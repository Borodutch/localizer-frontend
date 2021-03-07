<template lang="pug">
nav
  v-app-bar(app, flat, :color='dark ? "#0D0D0D" : "white"')
    // Title
    img.logo(src='/img/logo.svg', @click='goHome')
    v-spacer
    // Language picker
    v-menu(offset-y)
      template(v-slot:activator='{ on }')
        v-btn.navbar-button(text, v-on='on')
          .mt-1 {{ currentLocale.icon }}
      v-list
        v-list-item.text-center(
          v-for='locale in locales',
          @click='changeLanguage(locale.code)',
          :key='locale.code'
        )
          v-list-item-title.mt-1 {{ locale.icon }}
    // Dark theme
    v-btn.navbar-button(text, @click='toggleDark')
      img(src='/img/moon.svg')
    // Admin
    v-btn(text, :color='isAdmin ? "primary" : "grey"', @click='toggleAdmin')
      v-icon(small) vpn_key
    // Code
    v-btn(text, icon, color='grey', @click='$router.replace("/code")')
      v-icon(small) code
    // Refresh
    v-btn(text, icon, color='grey', @click='refresh')
      v-icon(small) autorenew
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { i18n } from '@/plugins/i18n'
import { namespace } from 'vuex-class'

const AppStore = namespace('AppStore')
const DataStore = namespace('DataStore')

@Component
export default class Navbar extends Vue {
  @AppStore.State dark!: boolean
  @AppStore.State isAdmin!: boolean

  @AppStore.Mutation setLanguage!: (language: string) => void
  @AppStore.Mutation setDark!: (dark: boolean) => void
  @AppStore.Mutation toggleAdmin!: () => void
  @DataStore.Mutation setLoading!: (loading: boolean) => void
  @DataStore.Action loadData!: () => void

  get locales() {
    return [
      { icon: '🇺🇸', code: 'en' },
      { icon: '🇷🇺', code: 'ru' },
    ]
  }

  get currentLocale() {
    for (const locale of this.locales) {
      if (locale.code === i18n.locale) {
        return locale
      }
    }
  }

  changeLanguage(locale: string) {
    i18n.locale = locale
    this.setLanguage(locale)
    document.title = i18n.t('title') as string
  }

  toggleDark() {
    this.setDark(!this.dark)
    ;(this.$vuetify.theme as any).dark = this.dark
  }

  goHome() {
    if (this.$router.currentRoute.path !== '/') {
      this.$router.replace('/')
    }
  }

  async refresh() {
    this.setLoading(true)
    try {
      await this.loadData()
    } catch (err) {
      console.error(err)
    } finally {
      this.setLoading(false)
    }
  }
}
</script>

<style scoped>
.logo {
  cursor: pointer;
}
</style>
