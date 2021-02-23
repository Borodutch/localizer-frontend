<template lang="pug">
div
  v-progress-linear.mb-4(v-if='loading', indeterminate)
  Filters(
    :languages='languages',
    :tags='tags',
    :nonlanguages='nonlanguages',
    :makeAllViewed='makeAllViewed'
  )
  v-pagination.mb-2(
    v-model='safePage',
    v-if='numberOfPages > 1',
    :length='numberOfPages'
  )
  LocalizationCard(
    v-for='localization in filteredData.slice(displaySkip, displaySkip + pageSize)',
    :key='localization.key',
    :languages='languages',
    :localization='localization',
    :loadData='loadData',
    :admin='admin'
  )
  v-pagination.mt-4(
    v-model='safePage',
    v-if='numberOfPages > 1',
    :length='numberOfPages'
  )
  TopContributors(:contributors='contributors')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '@/utils/api'
import LocalizationCard from '@/components/LocalizationCard.vue'
import TopContributors from '@/components/TopContributors.vue'
import Filters from '@/components/Filters.vue'
import { namespace } from 'vuex-class'
const randomColor = require('randomcolor')

const SnackbarStore = namespace('SnackbarStore')
const DataStore = namespace('DataStore')

@Component({
  components: {
    LocalizationCard,
    Filters,
    TopContributors,
  },
  props: {
    admin: Boolean,
  },
})
export default class LocalizationCards extends Vue {
  @DataStore.State viewedItems!: {
    [index: string]: boolean
  }
  @DataStore.State tags!: string[]
  @DataStore.State languages!: string[]
  @DataStore.State nonlanguages!: string[]
  @DataStore.State query!: string
  @DataStore.State newFilterOn!: boolean

  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void
  @DataStore.Mutation setColors!: (colors: Object) => void
  @DataStore.Mutation setViewedItems!: (viewedItems: {
    [index: string]: boolean
  }) => void

  data = [] as any[]
  loading = false
  page = 1
  pageSize = 20

  get filteredData() {
    return this.data
      .filter((l) => {
        if (!l.tags || !l.tags.length) {
          return true
        }
        for (const tag of l.tags) {
          if (this.tags.includes(tag)) {
            return true
          }
        }
        if (this.nonlanguages.length) {
          let doesNotContainLanguage = true
          for (const variant of l.variants) {
            if (
              variant.selected &&
              this.nonlanguages.includes(variant.language)
            ) {
              doesNotContainLanguage = false
            }
          }
          return doesNotContainLanguage
        }
        return false
      })
      .map((l) => {
        const newL = { ...l }
        newL.variants = newL.variants.filter(
          (v: any) =>
            this.languages.includes(v.language) ||
            this.nonlanguages.includes(v.language)
        )
        return newL
      })
      .filter((l) => {
        return !this.query || l.key.indexOf(this.query) > -1
      })
      .filter((l) => {
        // No filter
        if (!this.newFilterOn) {
          return true
        }
        const viewedItems = this.viewedItems
        // Localization is new
        if (!viewedItems[l._id]) {
          return true
        }
        // Has new variants or comments
        for (const variant of l.variants) {
          if (!viewedItems[variant._id]) {
            return true
          }
          for (const comments of variant.comments) {
            if (!viewedItems[comments._id]) {
              return true
            }
          }
        }
        // Fallback
        return false
      })
  }

  get numberOfPages() {
    return Math.ceil(this.filteredData.length / this.pageSize)
  }

  get displaySkip() {
    return (this.page <= this.numberOfPages ? this.page - 1 : 0) * this.pageSize
  }

  get safePage() {
    return Math.floor(this.page <= this.numberOfPages ? this.page : 1)
  }
  set safePage(newPage: number) {
    this.page = newPage
  }

  get contributors() {
    const contributors = {} as { [index: string]: number }
    for (const l of this.data) {
      for (const v of l.variants) {
        if (v.username && v.selected) {
          if (contributors[v.username]) {
            contributors[v.username]++
          } else {
            contributors[v.username] = 1
          }
        }
      }
    }
    return Object.keys(contributors)
      .map((k) => ({
        name: k,
        number: contributors[k],
      }))
      .sort((a, b) => (a.number > b.number ? -1 : 1))
  }

  mounted() {
    this.loadData()
  }

  async loadData() {
    this.loading = true
    try {
      const data = await api.getLocalizations()
      this.data = data
      this.data.forEach((l: any) => {
        l.variants = l.variants.sort((a: any, b: any) => {
          if (a.selected && !b.selected) {
            return -1
          } else if (!a.selected && b.selected) {
            return 1
          } else {
            return 0
          }
        })
      })
      const languages = new Set<string>()
      const localTags = new Set<string>()
      for (const localization of data) {
        for (const l of localization.variants.map((v: any) => v.language)) {
          languages.add(l)
        }
        for (const tag of localization.tags) {
          localTags.add(tag)
        }
      }
      this.languages = Array.from(languages)
      this.nonlanguages = Array.from(languages)
      this.tags = Array.from(localTags)
      const colors = {} as any
      const names = Array.from(
        this.languages.concat(this.tags).reduce((p, c) => {
          p.add(c)
          return p
        }, new Set())
      ) as string[]
      for (const name of names) {
        colors[name] = randomColor({ luminosity: 'dark', seed: name })
      }
      this.setColors(colors)
    } catch (err) {
      console.error(err)
      this.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
    console.log(this.languages)
  }

  makeAllViewed() {
    const viewed = {} as any
    for (const localization of this.data) {
      viewed[localization._id] = true
      for (const variant of localization.variants) {
        viewed[variant._id] = true
        for (const comment of variant.comments) {
          viewed[comment._id] = true
        }
      }
    }
    this.setViewedItems(viewed)
  }
}
</script>
