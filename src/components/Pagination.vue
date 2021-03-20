<template lang="pug">
.pagination(v-if='numberOfPages')
  .pagination__action(@click='previousPage')
    img(src='../assets/icons/left.svg', width=10)
  .pagination__page(
    v-for='page in numberOfPages',
    :class='page === pageProxy ? "pagination__page--active" : ""',
    @click='pageProxy = page'
  ) {{ page }}
  .pagination__action(@click='nextPage')
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

  nextPage() {
    this.setPage(Math.min(this.page + 1, this.numberOfPages))
  }

  previousPage() {
    this.setPage(this.page === 1 ? 1 : this.page - 1)
  }
}
</script>

<style lang="scss">
.pagination {
  @apply flex space-x-2 flex-wrap my-5 justify-center font-medium text-text-silver;

  &__action {
    @apply px-3 py-2 rounded-lg border mt-2 hover_border-primary-blue bg-white flex items-center cursor-pointer;
  }

  &__page {
    @apply px-3 py-2 rounded-lg border mt-2 hover_border-primary-blue bg-white cursor-pointer transition;

    &--active {
      @apply bg-primary-blue border-transparent text-white;
    }
  }
}

.dark {
  & .pagination__action,
  & .pagination__page {
    @apply border-text-dark bg-back-light-dark;
  }

  & .pagination__page--active {
    @apply border-primary-blue;
  }
}
</style>