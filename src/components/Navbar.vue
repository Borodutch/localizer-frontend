<template lang="pug">
header.header(:class='scrolled ? "header--shadow" : ""')
  .header__inner
    .header__logo
      img.logo(src='/img/logo.svg', alt='Localizer', @click='goHome')
    .header__menu(:class='scrolled ? "header__menu--scroll" : ""')
      Icon(@click='toggleDark')
        img(v-if='dark', src='@/assets/icons/sun.svg')
        img(v-else, src='@/assets/icons/moon.svg')
      Icon(@click='toggleAdmin')
        img(v-if='isAdmin', src='@/assets/icons/key-active.svg')
        img(v-else, src='@/assets/icons/key.svg')
      Icon(@click='goCode')
        img(v-if='isCode', src='@/assets/icons/arrows-active.svg')
        img(v-else, src='@/assets/icons/arrows.svg')
      Icon(@click='refresh')
        img(src='@/assets/icons/layers.svg')
      Dropdown(
        flat,
        :items='locales.map((locale) => locale.code)',
        @click='changeLanguage',
        :label='currentLocale.code'
      )
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
  isCode = false;

  created() {
    window.addEventListener('scroll', this.handleScroll);
    if (this.$router.currentRoute.path === '/code') {
      this.isCode = true;
    }
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
      this.isCode = false;
      this.$router.replace('/')
    }
  }

  goCode() {
    if (this.$router.currentRoute.path === '/code') {
      this.$router.replace('/')
      this.isCode = false;
    } else {
      this.$router.replace('/code')
      this.isCode = true;
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

<style lang="scss">
.logo {
  @apply cursor-pointer;
}

.header {
  @apply p-5;
  @apply md_sticky;
  @apply top-0;
  @apply shadow-none;
  @apply transition-shadow;
  @apply z-30;
  @apply bg-white;

  &--shadow {
    @apply shadow-none;
    @apply md_shadow-sm;
  }

  &__inner {
    @apply max-w-screen-xl;
    @apply mx-auto;
    @apply flex;
    @apply flex-col;
    @apply md_flex-row;
    @apply items-center;
    @apply justify-center;
    @apply space-y-3;
    @apply md_space-y-0;
    @apply md_justify-between;
  }

  &__menu {
    @apply bg-back-gray;
    @apply rounded-lg;
    @apply py-3;
    @apply px-4;
    @apply inline-flex;
    @apply transition;
    @apply space-x-5;
  }

  &__menu--scroll {
    @apply bg-back-gray;
    @apply bg-opacity-60;
    @apply md_bg-transparent;
  }
}

.dark {
  & .header {
    @apply bg-back-dark;

    &__menu {
      @apply bg-back-light-dark;
      @apply bg-opacity-80;
    }

    &__menu--scroll {
      @apply bg-transparent;
    }
  }
}
</style>
