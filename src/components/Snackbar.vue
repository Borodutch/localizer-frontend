<template lang="pug">
transition(name='fade')
  .fixed.top-2.left-0.right-0.z-50.text-center.font-medium.text-red-600(
    v-if='safeActive'
  )
    .p-5.bg-red-200.rounded-xl.inline-block
      .d-flex.flex-ro2.justify-space-between.align-center
        span {{ text + " " + color }}
        span.ml-4(@click='hideSnackbar')
          img.inline.cursor-pointer(src='../assets/icons/close.svg')
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

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>