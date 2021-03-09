<template lang="pug">
nav.navigation(:class='scrolled ? "navigation--shadow" : ""')
  .navigation__inner
    // Title
    .navigation__main-logo
      img.logo(src='/img/logo.svg', @click='goHome')
    .navigation__side-menu
      // Language picker
      div
        v-list
          v-list-item.text-center(
            v-for='locale in locales',
            @click='changeLanguage(locale.code)',
            :key='locale.code'
          )
            v-list-item-title.mt-1 {{ locale.icon }}
      // Dark theme
      .navbar-button(text, @click='toggleDark')
        img(src='/img/moon.svg')
      // Admin
      div(text, :color='isAdmin ? "primary" : "grey"', @click='toggleAdmin')
        v-icon(small) vpn_key
      // Code
      div(text, icon, color='grey', @click='$router.replace("/code")')
        v-icon(small) code
      // Refresh
      div(text, icon, color='grey', @click='refresh')
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

  scrolled = false;

  created() {
    window.addEventListener('scroll', this.handleScroll);
  }

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    this.scrolled = window.scrollY > 0;
  }

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
      ; (this.$vuetify.theme as any).dark = this.dark
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

<style lang="scss" scoped>
.navigation {
  @apply py-5 sticky top-0 bg-white shadow-none transition;

  &--shadow {
    @apply shadow-md;
  }

  &__inner {
    @apply max-w-screen-xl mx-auto flex items-center justify-between;
  }

  &__side-menu {
    @apply bg-gray-100 rounded-xl py-3 px-4 inline-flex;
  }
}
.logo {
  @apply cursor-pointer;
}
</style>
