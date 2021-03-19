<template lang="pug">
Input(:label='$t("search")', v-model='queryProxy', icon='search')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const DataStore = namespace('DataStore')

@Component
export default class SearchInput extends Vue {
  @DataStore.State query!: string

  @DataStore.Mutation setQuery!: (query: string) => void

  get queryProxy() {
    return this.query
  }
  set queryProxy(newQuery: string) {
    this.setQuery(newQuery)
  }
}
</script>
