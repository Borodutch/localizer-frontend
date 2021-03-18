<template lang="pug">
transition(name='fade')
  .snackbar(v-if='safeActive')
    .snackbar__inner(:class='`snackbar__inner--${color}`')
      span {{ text }}
      .snackbar__close(@click='hideSnackbar')
        img(src='../assets/icons/x.svg')
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