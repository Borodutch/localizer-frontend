<template lang="pug">
  .mb-2.d-flex.flex-wrap.justify-center
    v-chip.mx-1.my-1(
      v-for='tag in tags'
      :key='tag'
      :color='$store.state.tags.indexOf(tag) > -1 ? "primary" : ""'
      @click='toggleTag(tag)'
    ) {{tag}}
    v-chip.mx-1.my-1(
      v-for='language in languages'
      :key='language'
      :color='$store.state.languages.indexOf(language) > -1 ? "primary" : ""'
      @click='toggleLanguage(language)'
    ) {{language}}
    v-chip.mx-1.my-1(
      v-for='nonlanguage in nonlanguages'
      :key='nonlanguage'
      :color='$store.state.nonlanguages.indexOf(nonlanguage) > -1 ? "primary" : ""'
      @click='toggleNonlanguage(nonlanguage)'
    ) {{$t('no')}} {{nonlanguage}}
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
}
</script>
