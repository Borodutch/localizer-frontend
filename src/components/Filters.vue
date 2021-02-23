<template lang="pug">
.mb-2.d-flex.flex-wrap.justify-center.white--text
  v-chip.mx-1.my-1(
    dark,
    v-for='tag in tags',
    :key='tag',
    :color='$store.state.tags.indexOf(tag) > -1 ? $store.state.colors[tag] : ""',
    @click='toggleTag(tag)'
  ) {{ tag }}
  v-chip.mx-1.my-1(
    dark,
    v-for='language in languages',
    :key='language',
    :color='$store.state.languages.indexOf(language) > -1 ? $store.state.colors[language] : ""',
    @click='toggleLanguage(language)'
  ) {{ language }}
  v-chip.mx-1.my-1(
    dark,
    v-for='nonlanguage in nonlanguages',
    :key='`no-${nonlanguage}`',
    :color='$store.state.nonlanguages.indexOf(nonlanguage) > -1 ? $store.state.colors[nonlanguage] : ""',
    @click='toggleNonlanguage(nonlanguage)'
  ) {{ $t("no") }} {{ nonlanguage }}
  v-chip.mx-1.my-1(
    dark,
    :color='$store.state.newFilterOn ? "primary" : ""',
    @click='toggleNewFilterOn'
  ) {{ $t("new") }}
  v-menu(offset-y)
    template(v-slot:activator='{ on }')
      v-btn.ml-2.mt-1(v-on='on', text, icon)
        v-icon keyboard_arrow_down
    v-list
      v-list-item(@click='makeAllViewed')
        v-list-item-title Make all viewed
      v-list-item(@click='makeAllNew')
        v-list-item-title Make all new
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const AppStore = namespace('AppStore')
const DataStore = namespace('DataStore')

@Component({
  props: {
    makeAllViewed: Function,
  },
})
export default class Filters extends Vue {
  @DataStore.State tags!: string[]
  @DataStore.State languages!: string[]
  @DataStore.State nonlanguages!: string[]
  @AppStore.State newFilterOn!: boolean

  @DataStore.Mutation setTags!: (tags: string[]) => void
  @DataStore.Mutation setLanguages!: (languages: string[]) => void
  @DataStore.Mutation setNonlanguages!: (nonlanguages: string[]) => void
  @DataStore.Mutation setViewedItems!: (viewedItems: Object) => void
  @AppStore.Mutation setNewFilterOn!: (newFilterOn: boolean) => void

  toggleTag(tag: string) {
    if (this.tags.indexOf(tag) > -1) {
      this.setTags(this.tags.filter((t: any) => t !== tag))
    } else {
      this.setTags(this.tags.concat([tag]))
    }
  }

  toggleLanguage(language: string) {
    if (this.languages.indexOf(language) > -1) {
      this.setLanguages(this.languages.filter((t) => t !== language))
    } else {
      this.setLanguages(this.languages.concat([language]))
    }
  }

  toggleNonlanguage(nonlanguage: string) {
    if (this.nonlanguages.indexOf(nonlanguage) > -1) {
      this.setNonlanguages(
        this.nonlanguages.filter((t: any) => t !== nonlanguage)
      )
    } else {
      this.setNonlanguages(this.nonlanguages.concat([nonlanguage]))
    }
  }

  toggleNewFilterOn() {
    this.setNewFilterOn(!this.newFilterOn)
  }

  makeAllNew() {
    this.setViewedItems({})
  }
}
</script>
