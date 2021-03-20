<template lang="pug">
.card
  .card__head
    .card__icons
      Icon(
        v-if='isAdmin',
        @click='deleteLocalization(localization.key)',
        :loading='loading'
      ) 
        img(src='../assets/icons/close.svg', alt='Delete') 
      Icon(
        v-if='isAdmin',
        @click='selectOrDeleteVariantsEnabled = !selectOrDeleteVariantsEnabled',
        :loading='loading'
      )
        img(src='../assets/icons/edit.svg', alt='Edit') 
      Icon(@click='toggleAddVariantEnabled', :loading='loading') 
        img(src='../assets/icons/add.svg', alt='Add') 
    h2.card__title {{ localization.key }}
    .card__chips
      .flex.items-center.space-x-2.flex-wrap
        Chip(
          v-for='tag in localization.tags',
          :key='tag',
          :color='colors[tag]',
          small,
          selected,
          inactive
        ) 
          span {{ tag }}
          Icon(
            v-if='isAdmin',
            @click='deleteTag(localization.key, tag)',
            :loading='loading'
          )
            img(src='../assets/icons/x.svg', width=15) 
        Chip(
          isNew,
          small,
          v-if='!viewedItems[localization._id]',
          @click='setViewedProxy'
        ) {{ $t("new") }}
        Icon(v-if='isAdmin && !loading', @click='toggleAddTagEnabled') 
          img(src='../assets/icons/add.svg', alt='Add')
  .card__controls
    .input-group(v-if='addTagEnabled && isAdmin')
      Input(type='text', :label='$t("tag.new")', v-model='addTagText')
      Button(:inactive='!addTagText', @click='addTag') {{ $t("add.save") }}
    .input-group(v-if='addVariantEnabled')
      Input(type='text', :label='$t("add.text")', v-model='addVariantText')
      select.select(v-model='addVariantLanguage')
        option(disabled) {{ $t("add.language") }}
        option(v-for='lang in languages', :value='lang') {{ lang }}
      Button(
        :inactive='!(addVariantText && addVariantLanguage)',
        @click='addVariant()'
      ) {{ $t("add.save") }}
  div(v-if='selectOrDeleteVariantsEnabled')
    .flex.items-center.pl-5.pb-5
      Chip(@click='deleteVariants', :loading='loading') Delete
      Chip(@click='selectVariants', :loading='loading') Mark as done
  .card__body(
    v-for='variant in localization.variants',
    :class='selectedVariants[variant._id] ? "card__body--selected" : ""'
  )
    .flex.flex-row.space-x-3.items-center
      div(v-if='selectOrDeleteVariantsEnabled')
        Button(
          huge,
          v-model='selectedVariants[variant._id]',
          @click='addToSelected(variant._id)'
        ) {{ selectedVariants[variant._id] ? "Unselect" : "Select" }}
      VariantView(
        :variant='variant',
        :localization='localization',
        :selected='selectedVariants[variant._id]',
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

  addToSelected(id: string) {
    if (this.selectedVariants[id]) {
      this.selectedVariants[id] = undefined
    } else {
      this.selectedVariants = { ...this.selectedVariants, [id]: true }
    }
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

<style lang="scss">
.card {
  @apply transition mb-5 border border-back-silver rounded-lg shadow-sm bg-white;

  &__variant {
    @apply w-full;
  }

  &__title {
    @apply font-medium text-text-dark text-lg break-all place-self-start;
  }

  &__head {
    @apply p-5 flex justify-start space-x-0 md_space-x-5 flex-col md_flex-row items-center space-y-2 md_space-y-0;
  }

  &__chips {
    @apply place-self-start;
  }

  &__controls {
    @apply flex flex-col;
  }

  &__icons {
    @apply flex items-center place-self-start space-x-1;
  }

  &__body {
    @apply transition border-t-2 border-back-silver p-5;

    &--selected {
      @apply shadow-inner opacity-70;
    }
  }

  &__content {
    @apply pt-5 font-medium text-text-silver;
  }

  &__actions {
    @apply flex flex-wrap items-center;

    & > * {
      @apply pt-2 pr-3 md_pt-0;
    }
  }

  &__link {
    @apply transition font-medium text-text-silver cursor-pointer hover_text-primary-blue;
  }

  &__link--active {
    @apply text-primary-blue;
  }

  &__ratings {
    @apply flex items-center space-x-2 mx-3 ml-0 md_ml-3;
  }

  &__comments {
    @apply mt-5;
  }
}

.dark {
  & .card {
    @apply bg-black border-text-dark shadow-none;
  }

  & .card__title {
    @apply text-white;
  }

  & .card__body {
    @apply border-text-dark;
  }
}
</style>