<template lang="pug">
.card
  .card__head
    .card__icons.card__top-icons
      .card__icon(
        v-if='isAdmin',
        @click='deleteLocalization(localization.key)'
      ) 
        img(src='../assets/icons/close.svg') 
      .card__icon(
        v-if='isAdmin',
        @click='selectOrDeleteVariantsEnabled = !selectOrDeleteVariantsEnabled',
        :class='selectOrDeleteVariantsEnabled ? "green darken-2" : ""'
      )
        img(src='../assets/icons/edit.svg') 
      .card__icon(@click='toggleAddVariantEnabled') 
        img(src='../assets/icons/add.svg') 
    h2.card__title {{ localization.key }}
    .card__chips
      .chips.chips--margin
        .chip.chip--title.chip--selected(
          v-for='tag in localization.tags',
          :key='tag',
          :style='"background-color: " + colors[tag]'
        ) {{ tag }}
          span.ml-2.cursor-pointer(
            v-if='isAdmin',
            @click='deleteTag(localization.key, tag)'
          )
            img.inline(
              :class='loading ? "opacity-50" : ""',
              src='../assets/icons/x.svg',
              width=15
            ) 
        .chip.chip--new(
          v-if='!viewedItems[localization._id]',
          @click='setViewedProxy'
        ) {{ $t("new") }}
        .card__icon(v-if='isAdmin && !loading', @click='toggleAddTagEnabled') 
          img(src='../assets/icons/add.svg')
  .card__controls
    .input-group(v-if='addTagEnabled && isAdmin')
      input.input(
        type='text',
        :placeholder='$t("tag.new")',
        v-model='addTagText'
      )
      .button(v-if='addTagText', @click='addTag') {{ $t("add.save") }}
      .button.button--inactive(v-else) {{ $t("add.save") }}
    .input-group(v-if='addVariantEnabled')
      input.input(
        type='text',
        :placeholder='$t("add.text")',
        v-model='addVariantText'
      )
      select.select(v-model='addVariantLanguage')
        option(disabled) {{ $t("add.language") }}
        option(v-for='lang in languages', :value='lang') {{ lang }}
      .button(
        v-if='addVariantText && addVariantLanguage && username',
        @click='addVariant()'
      ) {{ $t("add.save") }}
      .button.button--inactive(v-else) {{ $t("add.save") }}
  div(v-if='selectOrDeleteVariantsEnabled')
    .chips.p-5.pt-0
      .chip(@click='deleteVariants', :loading='loading')
        v-icon(x-small, color='white') delete
      .chip(@click='selectVariants', :loading='loading')
        v-icon(x-small, color='white') done
  .card__body(v-for='variant in localization.variants')
    .d-flex.direction-row
      span(
        v-if='selectOrDeleteVariantsEnabled',
        v-model='selectedVariants[variant._id]'
      ) check
      VariantView(
        :variant='variant',
        :localization='localization',
        :selectOrDeleteVariantsEnabled='selectOrDeleteVariantsEnabled'
      )
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
import { ViewedItems } from '@/models/ViewedItems'

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
  @DataStore.State viewedItems!: ViewedItems

  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void
  @DataStore.Mutation setViewedItem!: (id: string) => void
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
  @DataStore.Mutation deleteLocalizationVariants!: (options: {
    key: string
    variantIds: string[]
  }) => void
  @DataStore.Mutation selectLocalizationVariants!: (options: {
    key: string
    variantIds: string[]
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

  selectedVariants = {} as any

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

  async deleteVariants() {
    const ids = Object.keys(this.selectedVariants).filter(
      (k) => !!this.selectedVariants[k]
    )
    const key = this.$props.localization.key
    this.performRequest(async () => {
      await api.deleteVariants(key, ids)
      this.deleteLocalizationVariants({ key, variantIds: ids })
      this.selectedVariants = {}
      this.selectOrDeleteVariantsEnabled = false
    })
  }

  selectVariants() {
    const ids = Object.keys(this.selectedVariants).filter(
      (k) => !!this.selectedVariants[k]
    )
    const key = this.$props.localization.key
    this.performRequest(async () => {
      await api.selectVariants(key, ids)
      this.selectLocalizationVariants({ key, variantIds: ids })
      this.selectedVariants = {}
      this.selectOrDeleteVariantsEnabled = false
    })
  }

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

  setViewedProxy() {
    this.setViewedItem(this.$props.localization._id)
    this.refreshLocalizations()
  }

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
