<template lang="pug">
  div
    v-progress-linear.mb-4(
      v-if='loading'
      indeterminate
    )
    Filters(
      :languages='languages'
      :tags='tags'
      :nonlanguages='nonlanguages'
      :makeAllViewed='makeAllViewed'
    )
    v-pagination.mb-2(
      v-model='safePage'
      v-if='numberOfPages > 1'
      :length='numberOfPages'
    )
    LocalizationCard(
      v-for='localization in filteredData.slice(displaySkip, displaySkip + pageSize)' :key='localization.key'
      :languages='languages'
      :localization='localization'
      :loadData='loadData'
      :admin='admin'
    )
    v-pagination.mt-4(
      v-model='safePage'
      v-if='numberOfPages > 1'
      :length='numberOfPages'
    )
    TopContributors(
      :contributors='contributors'
    )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as store from '../plugins/store'
import * as api from '../utils/api'
import { i18n } from '../plugins/i18n'
import LocalizationCard from './LocalizationCard.vue'
import TopContributors from './TopContributors.vue'
import Filters from './Filters.vue'
const randomColor = require('randomcolor')

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
          if (store.tags().includes(tag)) {
            return true
          }
        }
        if (store.nonlanguages().length) {
          let doesNotContainLanguage = true
          for (const variant of l.variants) {
            if (
              variant.selected &&
              store.nonlanguages().includes(variant.language)
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
            store.languages().includes(v.language) ||
            store.nonlanguages().includes(v.language)
        )
        return newL
      })
      .filter((l) => {
        return !store.query() || l.key.indexOf(store.query()) > -1
      })
      .filter((l) => {
        // No filter
        if (!store.newFilterOn()) {
          return true
        }
        const viewedItems = store.viewedItems()
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

  languages = [] as any[]
  nonlanguages = [] as any[]
  tags = [] as any[]

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
      const tags = new Set<string>()
      for (const localization of data) {
        for (const l of localization.variants.map((v: any) => v.language)) {
          languages.add(l)
        }
        for (const tag of localization.tags) {
          tags.add(tag)
        }
      }
      this.languages = Array.from(languages)
      this.nonlanguages = Array.from(languages)
      this.tags = Array.from(tags)
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
      store.setColors(colors)
    } catch (err) {
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
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
    store.setViewedItems(viewed)
  }
}
</script>
