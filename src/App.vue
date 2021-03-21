<template lang="pug">
.page.relative
  CookieMessage
  Navbar
  Snackbar
  router-view
</template>

<script lang="ts">
import Vue from 'vue'
import Navbar from '@/components/Navbar.vue'
import Snackbar from '@/components/Snackbar.vue'
import { i18n } from '@/plugins/i18n'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'
import CookieMessage from '@/components/CookieMessage.vue'

const AppStore = namespace('AppStore')

@Component({ components: { Navbar, Snackbar, CookieMessage } })
export default class App extends Vue {
  @AppStore.State dark!: boolean

  created() {
    if (this.dark) document.body.classList.add('dark')
    document.title = i18n.t('title') as string
  }
}
</script>
