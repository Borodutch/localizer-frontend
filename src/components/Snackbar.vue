<template lang="pug">
transition(name='fade')
  .snackbar(v-if='safeActive')
    .snackbar__inner(:class='`snackbar__inner--${color}`')
      span.snackbar__text {{ text }}
      .snackbar__close(@click='hideSnackbar')
        img(src='../assets/icons/x.svg', alt='Close')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { i18n } from '@/plugins/i18n'
import { namespace } from 'vuex-class'

const SnackbarStore = namespace('SnackbarStore')

@Component
export default class Snackbar extends Vue {
  @SnackbarStore.State active!: boolean
  @SnackbarStore.State color!: string
  @SnackbarStore.State message!: string
  @SnackbarStore.Mutation hideSnackbar!: () => void
  @SnackbarStore.Mutation setActive!: (active: boolean) => void

  get safeActive() {
    return this.active
  }
  set safeActive(active: boolean) {
    this.setActive(active)
  }

  get text() {
    const msg = this.message
    return typeof msg === 'string'
      ? msg === 'Internal Server Error'
        ? i18n.t('errors.internal')
        : i18n.t(this.message.toString())
      : (msg as any)[i18n.locale]
  }
}
</script>

<style lang="scss" scoped>
.snackbar {
  @apply fixed;
  @apply top-28;
  @apply left-0;
  @apply right-0;
  @apply z-50;
  @apply text-center;
  @apply font-medium;

  &__inner {
    @apply p-5;
    @apply rounded-xl;
    @apply inline-flex;
    @apply flex-row;
    @apply items-center;
    @apply space-x-3;

    &--error {
      @apply text-primary-red;
      @apply bg-additional-red;
    }

    &--success {
      @apply text-primary-green;
      @apply bg-additional-green;
    }
  }

  &__close {
    @apply transition;
    @apply bg-black;
    @apply bg-opacity-10;
    @apply cursor-pointer;
    @apply hover_bg-opacity-30;
    @apply rounded-md;
  }
}
</style>