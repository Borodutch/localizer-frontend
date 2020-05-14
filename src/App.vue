<template lang="pug">
  v-app(:dark='$store.state.dark')
    div(style='width: 100%' align='center')
      div(style='maxWidth: 1000px;' align='left')
        cookie-law(
          theme='blood-orange'
          :buttonText='$t("cookie.button")'
          :message='$t("cookie.message")'
        )
        Navbar
        Snackbar
        v-content
          router-view
</template>

<script lang="ts">
import Navbar from './components/Navbar.vue'
import Snackbar from './components/Snackbar.vue'
import * as store from './plugins/store'
import CookieLaw from 'vue-cookie-law'
import { i18n } from './plugins/i18n'

export default {
  components: { Navbar, Snackbar, CookieLaw },
  created() {
    ;(this as any).$vuetify.theme.dark = store.dark()
    document.title = i18n.t('title') as string
  },
}
</script>
