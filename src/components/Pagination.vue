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

<style lang="scss" scoped>
.pagination {
  @apply flex;
  @apply space-x-2;
  @apply flex-wrap;
  @apply my-5;
  @apply justify-center;
  @apply font-medium;
  @apply text-text-silver;

  &__action {
    @apply transition;
    @apply px-3;
    @apply py-2;
    @apply rounded-lg;
    @apply border-2;
    @apply mt-2;
    @apply hover_border-primary-blue;
    @apply flex;
    @apply items-center;
    @apply cursor-pointer;
  }

  &__page {
    @apply transition;
    @apply px-3;
    @apply py-2;
    @apply rounded-lg;
    @apply border-2;
    @apply mt-2;
    @apply hover_border-primary-blue;
    @apply cursor-pointer;

    &--active {
      @apply bg-primary-blue;
      @apply border-transparent;
      @apply text-white;
    }
  }
}

.dark .pagination {
  &__action,
  &__page {
    @apply border-dark-card-border;
    @apply hover_border-primary-blue;
  }

  &__page--active {
    @apply border-primary-blue;
  }
}
</style>