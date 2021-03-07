import { Variant } from '@/models/Variant'
import { Comment } from '@/models/Comment'
import { ColorsMap } from '@/models/ColorsMap'
import { ViewedItems } from '@/models/ViewedItems'
import { Contributor } from '@/models/Contributor'
import { Localization } from '@/models/Localization'
import {
  VuexModule,
  Module,
  MutationAction,
  Mutation,
} from 'vuex-module-decorators'
import * as api from '@/utils/api'
const randomColor = require('randomcolor')

@Module({ namespaced: true, name: 'DataStore' })
export default class DataStore extends VuexModule {
  localizations: Localization[] = []
  colors: ColorsMap = {}
  tags: string[] = []
  languages: string[] = []
  contributors: Contributor[] = []

  selectedTags: string[] = []
  selectedLanguages: string[] = []
  selectedNonlanguages: string[] = []
  newFilterEnabled = false

  upvoted: { [index: string]: boolean } = {}
  downvoted: { [index: string]: boolean } = {}
  viewedItems: ViewedItems = {}

  query: string = ''
  loading = false

  page = 1
  pageSize = 20

  get filteredAndPaginatedData() {
    return this.filteredData.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    )
  }

  private get filteredData() {
    return (
      this.localizations
        // Filter out new localizations
        .filter((localization) => {
          // No new filter enabled
          if (!this.newFilterEnabled) {
            return true
          }
          // Localization is new
          if (!this.viewedItems[localization._id]) {
            return true
          }
          // Has new variants or comments
          for (const variant of localization.variants) {
            if (!this.viewedItems[variant._id]) {
              return true
            }
            for (const comments of variant.comments) {
              if (!this.viewedItems[comments._id]) {
                return true
              }
            }
          }
          // Fallback
          return false
        })
        .filter((localization) => {
          // No tags, true
          if (!localization.tags || !localization.tags.length) {
            return true
          }
          // Tag selected, true
          for (const tag of localization.tags) {
            if (this.selectedTags.includes(tag)) {
              return true
            }
          }
          // Non languages not selected, ignore
          if (this.selectedNonlanguages.length) {
            // Check if it does not contain language
            let doesNotContainLanguage = true
            for (const variant of localization.variants) {
              if (
                variant.selected &&
                this.selectedNonlanguages.includes(variant.language)
              ) {
                doesNotContainLanguage = false
              }
            }
            return doesNotContainLanguage
          }
          // Otherwise, just return false
          return false
        })
        // Filter out non-relevant variants
        .map((localization) => {
          const localizationCopy = { ...localization }
          localizationCopy.variants = localizationCopy.variants.filter(
            (v: any) =>
              this.selectedLanguages.includes(v.language) ||
              this.selectedNonlanguages.includes(v.language)
          )
          return localizationCopy
        })
        // Take query into account
        .filter((l) => {
          return !this.query || l.key.indexOf(this.query) > -1
        })
    )
  }

  get numberOfPages() {
    return Math.ceil(this.filteredData.length / this.pageSize)
  }

  @Mutation
  setQuery(query: string) {
    this.query = query
  }

  @Mutation
  setPage(page: number) {
    if (page < 1) {
      this.page = 1
    } else if (page > this.numberOfPages) {
      this.page = this.numberOfPages
    } else {
      this.page = page
    }
  }

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  toggleTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(
        (selectedTag) => selectedTag !== tag
      )
    } else {
      this.selectedTags.push(tag)
    }
  }

  @Mutation
  toggleLanguage(language: string) {
    if (this.selectedLanguages.includes(language)) {
      this.selectedLanguages = this.selectedLanguages.filter(
        (selectedLanguage) => selectedLanguage !== language
      )
    } else {
      this.selectedLanguages.push(language)
    }
  }

  @Mutation
  toggleNonlanguage(nonlanguage: string) {
    if (this.selectedNonlanguages.includes(nonlanguage)) {
      this.selectedNonlanguages = this.selectedNonlanguages.filter(
        (selectedNonlanguage) => selectedNonlanguage !== nonlanguage
      )
    } else {
      this.selectedNonlanguages.push(nonlanguage)
    }
  }

  @Mutation
  toggleNewFilterEnabled() {
    this.newFilterEnabled = !this.newFilterEnabled
  }

  @Mutation
  markAllLocalizationsNew() {
    this.viewedItems = {}
  }

  @Mutation
  markAllLocalizationsViewed() {
    const viewed = {} as ViewedItems
    for (const localization of this.localizations) {
      viewed[localization._id] = true
      for (const variant of localization.variants) {
        viewed[variant._id] = true
        for (const comment of variant.comments) {
          viewed[comment._id] = true
        }
      }
    }
    this.viewedItems = viewed
  }

  @Mutation
  setViewedItem(id: string) {
    this.viewedItems[id] = true
  }

  @MutationAction({
    mutate: ['localizations', 'colors', 'tags', 'languages', 'contributors'],
  })
  async loadData() {
    // Get localizations
    const localizations = await api.getLocalizations()
    // Get languages and tags
    const languagesSet = new Set<string>()
    const tagsSet = new Set<string>()
    for (const localization of localizations) {
      for (const l of localization.variants.map((v: any) => v.language)) {
        languagesSet.add(l)
      }
      for (const tag of localization.tags) {
        tagsSet.add(tag)
      }
    }
    const languages = [...languagesSet]
    const tags = [...tagsSet]
    // Get colors
    const names = new Set([...tags, ...languages])
    const colors = {} as ColorsMap
    for (const name of names) {
      colors[name] = randomColor({ luminosity: 'dark', seed: name })
    }
    // Get contributors
    const contributorsMap = {} as { [index: string]: number }
    for (const localization of localizations) {
      for (const variant of localization.variants) {
        if (variant.username && variant.selected) {
          if (contributorsMap[variant.username]) {
            contributorsMap[variant.username]++
          } else {
            contributorsMap[variant.username] = 1
          }
        }
      }
    }
    const contributors = Object.keys(contributorsMap)
      .map((k) => ({
        name: k,
        number: contributorsMap[k],
      }))
      .sort((a, b) => (a.number > b.number ? -1 : 1))
    // Return result
    return {
      localizations,
      colors,
      tags,
      languages,
      contributors,
    }
  }

  @Mutation
  removeLocalization(key: string) {
    this.localizations = this.localizations.filter(
      (localization) => localization.key !== key
    )
  }

  @Mutation
  removeLocalizationTag(options: { key: string; tag: string }) {
    const localization = this.localizations.find(
      (localization) => localization.key === options.key
    )
    if (localization) {
      localization.tags = localization.tags.filter(
        (t: string) => t !== options.tag
      )
    }
  }

  @Mutation
  addLocalizationTag(options: { key: string; tag: string }) {
    const localization = this.localizations.find(
      (localization) => localization.key === options.key
    )
    if (localization && !localization.tags.includes(options.tag)) {
      localization.tags.push(options.tag)
    }
  }

  @Mutation
  addLocalizationVariant(options: { key: string; variant: Variant }) {
    const localization = this.localizations.find(
      (localization) => localization.key === options.key
    )
    if (localization) {
      localization.variants.push(options.variant)
    }
  }

  @Mutation
  deleteLocalizationVariant(options: { key: string; variant: Variant }) {
    const localization = this.localizations.find(
      (localization) => localization.key === options.key
    )
    if (localization) {
      localization.variants = localization.variants.filter(
        (variant) => variant._id !== options.variant._id
      )
    }
  }

  @Mutation
  toggleUpvote(options: { key: string; variant: Variant }) {
    const localization = this.localizations.find(
      (localization) => localization.key === options.key
    )
    if (!localization) {
      return
    }
    const variant = localization.variants.find(
      (v) => v._id === options.variant._id
    )
    if (!variant) {
      return
    }
    variant.upvotes += this.upvoted[options.variant._id] ? -1 : 1
    this.upvoted[options.variant._id] = !this.upvoted[options.variant._id]
  }

  @Mutation
  toggleDownvote(options: { key: string; variant: Variant }) {
    const localization = this.localizations.find(
      (localization) => localization.key === options.key
    )
    if (!localization) {
      return
    }
    const variant = localization.variants.find(
      (v) => v._id === options.variant._id
    )
    if (!variant) {
      return
    }
    variant.downvotes += this.downvoted[options.variant._id] ? -1 : 1
    this.downvoted[options.variant._id] = !this.downvoted[options.variant._id]
  }

  @Mutation
  selectLocalizationVariant(options: { key: string; variant: Variant }) {
    const localization = this.localizations.find(
      (localization) => localization.key === options.key
    )
    if (!localization) {
      return
    }
    for (const variant of localization.variants) {
      if (variant.language === options.variant.language) {
        variant.selected = false
      }
      if (variant._id === options.variant._id) {
        variant.selected = true
      }
    }
    localization.variants = localization.variants.sort((a: any, b: any) => {
      if (a.selected && !b.selected) {
        return -1
      } else if (!a.selected && b.selected) {
        return 1
      } else {
        return 0
      }
    })
  }

  @Mutation
  deleteLocalizationVariants(options: { key: string; variantIds: string[] }) {
    const localization = this.localizations.find(
      (localization) => localization.key === options.key
    )
    if (!localization) {
      return
    }
    localization.variants = localization.variants.filter(
      (variant) => !options.variantIds.includes(variant._id)
    )
  }

  @Mutation
  selectLocalizationVariants(options: { key: string; variantIds: string[] }) {
    const localization = this.localizations.find(
      (localization) => localization.key === options.key
    )
    if (!localization) {
      return
    }
    const variantsToSelect = localization.variants.filter((variant) =>
      options.variantIds.includes(variant._id)
    )
    const languagesToDeselect = variantsToSelect.map(
      (variant) => variant.language
    )
    for (const variant of localization.variants) {
      if (languagesToDeselect.includes(variant.language)) {
        variant.selected = false
      }
      if (options.variantIds.includes(variant._id)) {
        variant.selected = true
      }
    }
    localization.variants = localization.variants.sort((a: any, b: any) => {
      if (a.selected && !b.selected) {
        return -1
      } else if (!a.selected && b.selected) {
        return 1
      } else {
        return 0
      }
    })
  }

  @Mutation
  changeVariantText(options: { key: string; variant: Variant; text: string }) {
    const localization = this.localizations.find(
      (localization) => localization.key === options.key
    )
    if (!localization) {
      return
    }
    const variant = localization.variants.find(
      (v) => v._id === options.variant._id
    )
    if (!variant) {
      return
    }
    variant.text = options.text
  }

  @Mutation
  addComment(options: { key: string; variant: Variant; comment: Comment }) {
    const localization = this.localizations.find(
      (localization) => localization.key === options.key
    )
    if (!localization) {
      return
    }
    const variant = localization.variants.find(
      (v) => v._id === options.variant._id
    )
    if (!variant) {
      return
    }
    variant.comments.push(options.comment)
  }

  @Mutation
  deleteComment(options: { key: string; variant: Variant; comment: Comment }) {
    const localization = this.localizations.find(
      (localization) => localization.key === options.key
    )
    if (!localization) {
      return
    }
    const variant = localization.variants.find(
      (v) => v._id === options.variant._id
    )
    if (!variant) {
      return
    }
    variant.comments = variant.comments.filter(
      (comment) => comment._id !== options.comment._id
    )
  }

  @Mutation
  refreshLocalizations() {
    // localizations
    this.localizations = this.localizations
    // languages and tags
    const languagesSet = new Set<string>()
    const tagsSet = new Set<string>()
    for (const localization of this.localizations) {
      for (const l of localization.variants.map((v: any) => v.language)) {
        languagesSet.add(l)
      }
      for (const tag of localization.tags) {
        tagsSet.add(tag)
      }
    }
    this.languages = [...languagesSet]
    this.tags = [...tagsSet]
    // colors
    const names = new Set([...this.tags, ...this.languages])
    const colors = {} as ColorsMap
    for (const name of names) {
      colors[name] = randomColor({ luminosity: 'dark', seed: name })
    }
    this.colors = colors
  }
}
