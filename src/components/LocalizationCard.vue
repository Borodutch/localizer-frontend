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
    v-btn.mr-1(
      v-if='isAdmin',
      small,
      icon,
      @click='isEditActive = !isEditActive',
      :loading='loading',
      :class='select ? "green darken-2" : ""'
    )
      v-icon(small) edit
    v-btn.mr-1(v-if='!edit', small, icon, @click='edit = true')
      v-icon(small) add
    v-btn.mr-1(v-else, small, icon, @click='edit = false', color='red')
      v-icon(small) clear
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
        @click='deleteLocalizationTag(localization.key, tag)',
        :disabled='loading'
      )
        v-icon(small, v-if='!loading') close
        span(v-else) 🤔
    v-chip.mx-1.px-1(
      v-if='!viewedItems[localization._id]',
      dark,
      small,
      @mouseover='setViewedItem(localization._id)',
      color='primary'
    ) {{ $t("new") }}
    v-chip.mx-1.px-1(
      dark,
      small,
      v-if='isAdmin',
      :color='addTag ? "green darken-2" : ""',
      @click='addTag = !addTag'
    )
      v-icon(small, v-if='!loading') {{ addTag ? "close" : "add" }}
    v-text-field.mx-1.mb-0.mt-4.px-0.py-0(
      :label='$t("tag.new")',
      v-if='addTag',
      clearable,
      rows='1',
      auto-grow,
      no-resize,
      compact,
      v-model='addTagText',
      :append-outer-icon='!!addTagText ? "send" : undefined',
      @click:append-outer='saveNewTag',
      :disabled='loading'
    )
  v-card-text
    div(v-if='edit')
      v-textarea.mb-1.mt-0.pt-0(
        :label='$t("add.text")',
        clearable,
        rows='1',
        :rules='textRules',
        auto-grow,
        no-resize,
        compact,
        v-model='text'
      )
      .d-flex
        v-select.mb-1.mt-0.pt-0(
          :label='$t("add.language")',
          :items='languages',
          :rules='languageRules',
          v-model='language'
        )
        v-btn.ml-2(
          color='primary',
          :disabled='!text || !language',
          @click='save(localization.key)',
          :loading='loading'
        ) {{ $t("add.save") }}
    div(v-if='isEditActive')
      v-chip.px-1(
        dark,
        x-small,
        color='red',
        @click='deleteVariants(localization.key)',
        :loading='loading'
      )
        v-icon(x-small, color='white') delete
      v-chip.px-1(
        dark,
        x-small,
        color='green',
        @click='selectVariants(localization.key)',
        :loading='loading'
      )
        v-icon(x-small, color='white') done
    div(v-for='variant in localization.variants')
      .d-flex.direction-row
        v-checkbox(v-if='isEditActive', v-model='selected[variant._id]')
        //- Variant(
        //-   :variant='variant',
        //-   :localization='localization',
        //-   :select='select'
        //- )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { i18n } from '@/plugins/i18n'
import * as api from '@/utils/api'
// import Variant from '@/components/Variant.vue'
import { namespace } from 'vuex-class'
import { ColorsMap } from '@/models/ColorsMap'
import { ViewedItems } from '@/models/ViewedItems'

const SnackbarStore = namespace('SnackbarStore')
const AppStore = namespace('AppStore')
const DataStore = namespace('DataStore')

@Component({
  props: {
    localization: Object,
  },
  components: {
    // Variant,
  },
})
export default class LocalizationCard extends Vue {
  @AppStore.State username!: string
  @AppStore.State isAdmin!: boolean
  @DataStore.State colors!: ColorsMap
  @DataStore.State viewedItems!: ViewedItems

  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void
  @DataStore.Mutation setViewedItem!: (id: string) => void
  @DataStore.Mutation removeLocalization!: (key: string) => void

  text = ''
  language = ''
  addTagText = ''

  edit = false
  isEditActive = false
  addTag = false

  textRules = [(v: any) => !!(v || '').trim() || i18n.t('errors.textLength')]
  languageRules = [(v: any) => !!(v || '').trim() || i18n.t('errors.language')]

  loading = false

  selected = {} as any

  async deleteLocalization(key: string) {
    this.performRequest(async () => {
      await api.deleteLocalization(key)
      this.removeLocalization(key)
    })
  }

  async save(key: string) {
    this.performRequest(async () => {
      await api.postVariant(key, this.text, this.language, this.username)
      this.$props.loadData()
      this.text = ''
      this.edit = false
    })
  }

  async saveNewTag() {
    this.performRequest(async () => {
      if (this.$props.localization.tags.indexOf(this.addTagText) < 0) {
        await api.addLocalizationTag(
          this.$props.localization.key,
          this.addTagText
        )
        this.$props.localization.tags.push(this.addTagText)
      }
      this.addTagText = ''
    })
  }

  async deleteLocalizationTag(key: string, tag: string) {
    this.performRequest(async () => {
      await api.deleteLocalizationTag(key, tag)
      this.$props.localization.tags = this.$props.localization.tags.filter(
        (t: string) => t !== tag
      )
    })
  }

  async deleteVariants(key: string) {
    this.performRequest(async () => {
      await api.deleteVariants(
        key,
        Object.keys(this.selected).filter((k) => !!this.selected[k])
      )
      this.selected = {}
      this.isEditActive = false
      this.$props.loadData()
    })
  }

  selectVariants(key: string) {
    this.performRequest(async () => {
      await api.selectVariants(
        key,
        Object.keys(this.selected).filter((k) => !!this.selected[k])
      )
      this.selected = {}
      this.edit = false
      this.$props.loadData()
    })
  }

  async performRequest(requestFunction: () => Promise<unknown>) {
    this.loading = true
    try {
      await requestFunction()
    } catch (err) {
      this.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }
}
</script>
