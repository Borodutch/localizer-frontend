<template lang="pug">
  div
    v-progress-linear(
      v-if='loading'
      indeterminate
    )
    Filters(
      :languages='languages'
      :tags='tags'
      :setTagFilter='setTagFilter'
    )
    LocalizationCard(
      v-for='localization in filteredData' :key='localization.key'
      :languages='languages'
      :localization='localization'
      :loadData='loadData'
      :admin='admin'
    )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as store from '../plugins/store'
import * as api from '../utils/api'
import { i18n } from '../plugins/i18n'
import LocalizationCard from './LocalizationCard.vue'
import Filters from './Filters.vue'

@Component({
  components: {
    LocalizationCard,
    Filters,
  },
  props: {
    admin: Boolean,
  },
})
export default class LocalizationCards extends Vue {
  data = [] as any[]
  loading = false

  get filteredData() {
    return this.data
      .filter((l) => {
        for (const tag of l.tags) {
          if (store.tags().includes(tag)) {
            return true
          }
        }
        return false
      })
      .map((l) => {
        const newL = { ...l }
        newL.variants = newL.variants.filter((v: any) =>
          store.languages().includes(v.language)
        )
        return newL
      })
  }

  languages = [] as any[]
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
      this.tags = Array.from(tags)
    } catch (err) {
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }
}
</script>
