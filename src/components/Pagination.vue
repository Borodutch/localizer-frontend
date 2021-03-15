<template lang="pug">
//- v-pagination.mb-2(
//-   v-model='pageProxy',
//-   v-if='numberOfPages > 1',
//-   :length='numberOfPages'
//- )
.pagination
  .pagination__action
    img(src='../assets/icons/left.svg', width=10)
  .pagination__page(
    v-for='page in numberOfPages',
    :class='page === pageProxy ? "pagination__page--active" : ""',
    @click='pageProxy = page'
  ) {{ page }}
  .pagination__action
    img(src='../assets/icons/right.svg', width=10)
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
