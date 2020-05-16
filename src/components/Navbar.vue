<template lang="pug">
  nav
    v-app-bar(flat app style='maxWidth: 1000px; margin: auto')
      // Title
      v-toolbar-title.text-uppercase.grey--text
        a(@click='goHome') {{$t('title')}}
      v-spacer
      // Dark mode
      v-btn(text icon color='grey' @click='toggleMode')
        v-icon(small) brightness_2
      // Admin
      v-btn(text icon color='grey' @click='goToAdmin')
        v-icon(small) vpn_key
      // Admin
      v-btn(text icon color='grey' @click='goToCode')
        v-icon(small) code
      // Language picker
      v-menu(offset-y)
        template(v-slot:activator='{ on }')
          v-btn(text icon color='grey' v-on='on') {{currentLocale.icon}}
        v-list
          v-list-item(
            v-for='locale in locales'
            @click='changeLanguage(locale.code)'
            :key="locale.code"
          )
            v-list-item-title {{locale.icon}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as store from '../plugins/store'
import { i18n } from '../plugins/i18n'
import * as api from '../utils/api'

@Component
export default class Navbar extends Vue {
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

  toggleMode() {
    store.setDark(!store.dark())
    ;(this.$vuetify.theme as any).dark = store.dark()
  }
  changeLanguage(locale: string) {
    i18n.locale = locale
    store.setLanguage(locale)
    document.title = i18n.t('title') as string
  }
  goHome() {
    this.$router.replace('/')
  }
  goToAdmin() {
    this.$router.replace('/admin')
  }
  goToCode() {
    this.$router.replace('/code')
  }
}
</script>

<style>
nav a:link {
  text-decoration: none;
}

nav a:visited {
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

nav a:active {
  text-decoration: underline;
}
</style>
