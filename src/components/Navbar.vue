<template lang="pug">
nav.navigation(:class='scrolled ? "navigation--shadow" : ""')
  .navigation__inner
    // Title
    .navigation__main-logo
      img.logo(src='/img/logo.svg', @click='goHome')
    .navigation__side-menu(
      :class='scrolled ? "navigation__side-menu--scroll" : ""'
    )
      // Dark theme
      .navigation__button(text, @click='toggleDark')
        img(src='@/assets/icons/moon.svg')
      // Admin
      .navigation__button(
        text,
        :color='isAdmin ? "primary" : "grey"',
        @click='toggleAdmin'
      )
        img(src='@/assets/icons/key.svg')
      // Code
      .navigation__button(
        text,
        icon,
        color='grey',
        @click='$router.replace("/code")'
      )
        img(src='@/assets/icons/arrows.svg')
      // Refresh
      .navigation__button(text, icon, color='grey', @click='refresh')
        img(src='@/assets/icons/layers.svg')
      v-list
        v-list-item.text-center(
          v-for='locale in locales',
          @click='changeLanguage(locale.code)',
          :key='locale.code'
        )
          v-list-item-title.mt-1.text-text-silver.font-medium {{ locale.code }}
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
      // { icon: '🇷🇺', code: 'ru' },
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
  @apply p-5 sticky top-0 shadow-none transition-shadow z-50;

  &--shadow {
    @apply shadow-card;
  }

  &__inner {
    @apply max-w-screen-xl mx-auto flex items-center justify-between;
  }

  &__side-menu {
    @apply bg-back-gray rounded-lg py-3 px-4 inline-flex transition space-x-5;
  }

  &__side-menu--scroll {
    @apply bg-transparent;
  }

  &__button {
    @apply cursor-pointer;
  }
}
.logo {
  @apply cursor-pointer;
}
.navigation {
  backdrop-filter: blur(5px) saturate(200%);
  background: rgba(255, 255, 255, 0.8);
}
</style>
