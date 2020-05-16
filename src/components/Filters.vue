<template lang="pug">
  .mb-2.d-flex.flex-wrap.justify-center.white--text
    v-chip.mx-1.my-1(
      dark
      v-for='tag in tags'
      :key='tag'
      :color='$store.state.tags.indexOf(tag) > -1 ? $store.state.colors[tag] : ""'
      @click='toggleTag(tag)'
    ) {{tag}}
    v-chip.mx-1.my-1(
      dark
      v-for='language in languages'
      :key='language'
      :color='$store.state.languages.indexOf(language) > -1 ? $store.state.colors[language] : ""'
      @click='toggleLanguage(language)'
    ) {{language}}
    v-chip.mx-1.my-1(
      dark
      v-for='nonlanguage in nonlanguages'
      :key='`no-${nonlanguage}`'
      :color='$store.state.nonlanguages.indexOf(nonlanguage) > -1 ? $store.state.colors[nonlanguage] : ""'
      @click='toggleNonlanguage(nonlanguage)'
    ) {{$t('no')}} {{nonlanguage}}
    v-chip.mx-1.my-1(
      dark
      :color='$store.state.newFilterOn ? "primary" : ""'
      @click='toggleNewFilterOn'
    ) {{$t('new')}}
    v-menu(offset-y)
      template(v-slot:activator='{ on }')
        v-btn.ml-2.mt-1(v-on='on' text icon)
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
import * as store from '../plugins/store'
import { Watch } from 'vue-property-decorator'

@Component({
  props: {
    languages: Array,
    nonlanguages: Array,
    tags: Array,
    makeAllViewed: Function,
  },
})
export default class Filters extends Vue {
  toggleTag(tag: string) {
    if (store.tags().indexOf(tag) > -1) {
      store.setTags(store.tags().filter((t) => t !== tag))
    } else {
      store.setTags(store.tags().concat([tag]))
    }
  }

  toggleLanguage(language: string) {
    if (store.languages().indexOf(language) > -1) {
      store.setLanguages(store.languages().filter((t) => t !== language))
    } else {
      store.setLanguages(store.languages().concat([language]))
    }
  }

  toggleNonlanguage(nonlanguage: string) {
    if (store.nonlanguages().indexOf(nonlanguage) > -1) {
      store.setNonlanguages(
        store.nonlanguages().filter((t) => t !== nonlanguage)
      )
    } else {
      store.setNonlanguages(store.nonlanguages().concat([nonlanguage]))
    }
  }

  toggleNewFilterOn() {
    store.setNewFilterOn(!store.newFilterOn())
  }

  makeAllNew() {
    store.setViewedItems({})
  }
}
</script>
