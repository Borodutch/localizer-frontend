<template lang="pug">
header.navigation(:class='scrolled ? "navigation--shadow" : ""')
  .navigation__inner
    .navigation__main-logo
      img.logo(src='/img/logo.svg', @click='goHome')
    .navigation__side-menu(
      :class='scrolled ? "navigation__side-menu--scroll" : ""'
    )
      .navigation__button(@click='toggleDark')
        img(src='@/assets/icons/moon.svg')
      .navigation__button(
        :color='isAdmin ? "primary" : "grey"',
        @click='toggleAdmin'
      )
        img(src='@/assets/icons/key.svg')
      .navigation__button(color='grey', @click='$router.replace("/code")')
        img(src='@/assets/icons/arrows.svg')
      .navigation__button(@click='refresh')
        img(src='@/assets/icons/layers.svg')
      .text-text-silver.font-medium.cursor-pointer(
        v-for='locale in locales',
        @click='changeLanguage(locale.code)',
        :key='locale.code',
        v-if='locale.code !== currentLocale.code'
      ) {{ locale.code }}
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
    if (this.dark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
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
