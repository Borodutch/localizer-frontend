<template lang="pug">
v-text-field.my-0.py-0(
  :label='$t("search")',
  v-model='queryProxy',
  append-icon='search'
)
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const AppStore = namespace('AppStore')

@Component
export default class SearchInput extends Vue {
  @AppStore.State query!: string

  @AppStore.Mutation setQuery!: (query: string) => void

  get queryProxy() {
    return this.query
  }
  set queryProxy(newQuery: string) {
    this.setQuery(newQuery)
  }
}
</script>
