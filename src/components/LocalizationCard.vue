<template lang="pug">
v-card.mb-2
  v-card-title
    v-btn.mr-1(
      v-if='isAdmin',
      color='red',
      small,
      icon,
      @click='deleteLocalization(localization.key)',
      :loading='loading'
    )
      v-icon(small) delete
    //- v-btn.mr-1(
    //-   v-if='isAdmin',
    //-   small,
    //-   icon,
    //-   @click='selectOrDeleteVariantsEnabled = !selectOrDeleteVariantsEnabled',
    //-   :loading='loading',
    //-   :class='selectOrDeleteVariantsEnabled ? "green darken-2" : ""'
    //- )
    //-   v-icon(small) edit
    v-btn.mr-1(
      small,
      icon,
      @click='toggleAddVariantEnabled',
      :color='addVariantEnabled ? "red" : undefined'
    )
      v-icon(small) {{ addVariantEnabled ? "clear" : "add" }}
    span.mx-1 {{ localization.key }}
    v-chip.mx-1(
      dark,
      small,
      v-for='tag in localization.tags',
      :key='tag',
      :color='colors[tag]'
    )
      span {{ tag }}
      .ml-2(
        small,
        v-if='isAdmin',
        @click='deleteTag(localization.key, tag)',
        :disabled='loading'
      )
        v-icon(small, v-if='!loading') close
        span(v-else) 🤔
    //- v-chip.mx-1.px-1(
    //-   v-if='isNew',
    //-   dark,
    //-   small,
    //-   @mouseover='setViewedProxy',
    //-   color='primary'
    //- ) {{ $t("new") }}
    v-chip.ma-1.px-1(
      dark,
      small,
      v-if='isAdmin && !loading',
      :color='addTagEnabled ? "green darken-2" : ""',
      @click='toggleAddTagEnabled'
    )
      v-icon(small) {{ addTagEnabled ? "close" : "add" }}
    v-text-field.mx-1.mb-0.mt-4.px-0.py-0(
      :label='$t("tag.new")',
      v-if='addTagEnabled && isAdmin',
      clearable,
      rows='1',
      auto-grow,
      no-resize,
      compact,
      v-model='addTagText',
      :append-outer-icon='!!addTagText ? "send" : undefined',
      @click:append-outer='addTag',
      :disabled='loading'
    )
  v-card-text
    div(v-if='addVariantEnabled')
      v-textarea.mb-1.mt-0.pt-0(
        :label='$t("add.text")',
        clearable,
        rows='1',
        :rules='textRules',
        auto-grow,
        no-resize,
        compact,
        v-model='addVariantText'
      )
      .d-flex
        v-select.mb-1.mt-0.pt-0(
          :label='$t("add.language")',
          :items='languages',
          :rules='languageRules',
          v-model='addVariantLanguage'
        )
        v-btn.ml-2(
          color='primary',
          :disabled='!addVariantText || !addVariantLanguage',
          @click='addVariant()',
          :loading='loading'
        ) {{ $t("add.save") }}
    //- div(v-if='selectOrDeleteVariantsEnabled')
    //-   v-chip.px-1(
    //-     dark,
    //-     x-small,
    //-     color='red',
    //-     @click='deleteVariants(localization.key)',
    //-     :loading='loading'
    //-   )
    //-     v-icon(x-small, color='white') delete
    //-   v-chip.px-1(
    //-     dark,
    //-     x-small,
    //-     color='green',
    //-     @click='selectVariants(localization.key)',
    //-     :loading='loading'
    //-   )
    //-     v-icon(x-small, color='white') done
    div(v-for='variant in localization.variants')
      .d-flex.direction-row
        //- v-checkbox(v-if='editKeyEnabled', v-model='selected[variant._id]')
        VariantView(:variant='variant', :localization='localization')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { i18n } from '@/plugins/i18n'
import * as api from '@/utils/api'
import VariantView from '@/components/Variant.vue'
import { namespace } from 'vuex-class'
import { ColorsMap } from '@/models/ColorsMap'
import { Variant } from '@/models/Variant'
// import { ViewedItems } from '@/models/ViewedItems'

const SnackbarStore = namespace('SnackbarStore')
const AppStore = namespace('AppStore')
const DataStore = namespace('DataStore')

@Component({
  props: {
    localization: Object,
  },
  components: {
    VariantView,
  },
})
export default class LocalizationCard extends Vue {
  @AppStore.State username!: string
  @AppStore.State isAdmin!: boolean
  @DataStore.State colors!: ColorsMap
  @DataStore.State languages!: string[]
  // @DataStore.State viewedItems!: ViewedItems

  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void
  // @DataStore.Mutation setViewedItem!: (id: string) => void
  @DataStore.Mutation removeLocalization!: (key: string) => void
  @DataStore.Mutation removeLocalizationTag!: (options: {
    key: string
    tag: string
  }) => void
  @DataStore.Mutation addLocalizationTag!: (options: {
    key: string
    tag: string
  }) => void
  @DataStore.Mutation addLocalizationVariant!: (options: {
    key: string
    variant: Variant
  }) => void
  @DataStore.Mutation refreshLocalizations!: () => void

  addVariantText = ''
  addVariantLanguage = ''
  addTagText = ''

  addVariantEnabled = false
  selectOrDeleteVariantsEnabled = false
  addTagEnabled = false

  textRules = [(v: any) => !!(v || '').trim() || i18n.t('errors.textLength')]
  languageRules = [(v: any) => !!(v || '').trim() || i18n.t('errors.language')]

  loading = false

  // selected = {} as any

  // isNew = false

  // mounted() {
  //   this.isNew = !this.viewedItems[this.$props.localization._id]
  // }

  async deleteLocalization(key: string) {
    this.performRequest(async () => {
      await api.deleteLocalization(key)
      this.removeLocalization(key)
    })
  }

  async addVariant() {
    const key = this.$props.localization.key
    this.performRequest(async () => {
      const variant = await api.postVariant(
        key,
        this.addVariantText,
        this.addVariantLanguage,
        this.username
      )
      this.addLocalizationVariant({ key, variant })
      this.resetAddVariant()
    })
  }

  async addTag() {
    const tag = this.addTagText
    const key = this.$props.localization.key
    this.performRequest(async () => {
      if (!this.$props.localization.tags.includes(tag)) {
        await api.addLocalizationTag(key, tag)
        this.addLocalizationTag({ key, tag })
        this.refreshLocalizations()
      }
      this.resetAddTag()
    })
  }

  async deleteTag(key: string, tag: string) {
    this.performRequest(async () => {
      if (this.$props.localization.tags.includes(tag)) {
        await api.deleteLocalizationTag(key, tag)
        this.removeLocalizationTag({ key, tag })
        this.refreshLocalizations()
      }
    })
  }

  // async deleteVariants(key: string) {
  //   this.performRequest(async () => {
  //     await api.deleteVariants(
  //       key,
  //       Object.keys(this.selected).filter((k) => !!this.selected[k])
  //     )
  //     this.selected = {}
  //     // this.editKeyEnabled = false
  //     this.$props.loadData()
  //   })
  // }

  // selectVariants(key: string) {
  //   this.performRequest(async () => {
  //     await api.selectVariants(
  //       key,
  //       Object.keys(this.selected).filter((k) => !!this.selected[k])
  //     )
  //     this.selected = {}
  //     // this.editKeyEnabled = false
  //     this.$props.loadData()
  //   })
  // }

  async performRequest(requestFunction: () => Promise<unknown>) {
    this.loading = true
    try {
      await requestFunction()
    } catch (err) {
      console.error(err)
      this.setSnackbarError(err.response?.data || JSON.stringify(err))
    } finally {
      this.loading = false
    }
  }

  // setViewedProxy() {
  //   this.setViewedItem(this.$props.localization._id)
  //   this.isNew = false
  // }

  toggleAddTagEnabled() {
    this.addTagEnabled = !this.addTagEnabled
    if (!this.addTagEnabled) {
      this.resetAddTag()
    }
  }

  resetAddTag() {
    this.addTagText = ''
    this.addTagEnabled = false
  }

  toggleAddVariantEnabled() {
    this.addVariantEnabled = !this.addVariantEnabled
    if (!this.addVariantEnabled) {
      this.resetAddVariant()
    }
  }

  resetAddVariant() {
    this.addVariantText = ''
    this.addVariantEnabled = false
  }
}
</script>
