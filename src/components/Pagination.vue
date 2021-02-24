<template lang="pug">
v-pagination.mb-2(
  v-model='pageProxy',
  v-if='numberOfPages > 1',
  :length='numberOfPages'
)
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const DataStore = namespace('DataStore')

@Component
export default class Pagination extends Vue {
  @DataStore.State page!: number
  @DataStore.Getter numberOfPages!: number

  @DataStore.Mutation setPage!: (page: number) => void

  get pageProxy() {
    return this.page
  }
  set pageProxy(page: number) {
    this.setPage(page)
  }
}
</script>
