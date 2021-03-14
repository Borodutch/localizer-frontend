<template lang="pug">
//- v-pagination.mb-2(
//-   v-model='pageProxy',
//-   v-if='numberOfPages > 1',
//-   :length='numberOfPages'
//- )
.flex.space-x-2.my-5.justify-center.font-medium.text-text-silver
  .px-3.py-2.rounded-lg.border.bg-white.flex.items-center
    img(src='../assets/icons/left.svg', width=10)
  .px-3.py-2.rounded-lg.border.bg-white.cursor-pointer.transition(
    v-for='page in numberOfPages',
    :class='page === pageProxy ? "bg-primary-blue border-transparent text-white" : ""',
    @click='pageProxy = page'
  ) {{ page }}
  .px-3.py-2.rounded-lg.border.bg-white.flex.items-center
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
