<template lang="pug">
.contributors(v-if='contributors.length')
  .contributors__title {{ $t("top") }}
  .flex.flex-wrap
    Chip(
      inactive,
      v-for='contributor in contributors',
      :key='contributor.name'
    ) {{ contributor.name }}
      sup.font-bold.ml-1.text-text-silver {{ contributor.number }}
</template>

<script lang="ts">
import { Contributor } from '@/models/Contributor'
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const DataStore = namespace('DataStore')

@Component
export default class TopContributors extends Vue {
  @DataStore.State contributors!: Contributor[]
}
</script>

<style lang="scss">
.contributors {
  @apply transition;
  @apply my-10;
  @apply p-5;
  @apply bg-additional-blue;
  @apply rounded-lg;
  @apply text-center;
  @apply shadow-blue;

  &__title {
    @apply font-bold;
    @apply mb-2;
    @apply text-primary-blue;
    @apply text-lg;
  }
}

.dark .contributors {
  @apply bg-text-dark;
  @apply shadow-none;

  &__title {
    @apply text-white;
  }
}
</style>
