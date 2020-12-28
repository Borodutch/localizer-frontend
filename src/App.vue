<template lang="pug">
v-app
  div(style='width: 100%', align='center')
    div(style='maxwidth: 1000px', align='left')
      cookie-law(
        theme='blood-orange',
        :buttonText='$t("cookie.button")',
        :message='$t("cookie.message")'
      )
      Navbar
      Snackbar
      v-main
        router-view
</template>

<script lang="ts">
import Vue from 'vue'
import Navbar from '@/components/Navbar.vue'
import Snackbar from '@/components/Snackbar.vue'
import CookieLaw from 'vue-cookie-law'
import { i18n } from '@/plugins/i18n'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const AppStore = namespace('AppStore')

@Component({ components: { Navbar, CookieLaw, Snackbar } })
export default class App extends Vue {
  @AppStore.State dark!: boolean

  created() {
    ;(this as any).$vuetify.theme.dark = this.dark
    document.title = i18n.t('title') as string
  }
}
</script>
