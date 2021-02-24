<template lang="pug">
.mb-2.d-flex.flex-wrap.justify-center.white--text
  v-chip.mx-1.my-1(
    dark,
    v-for='tag in tags',
    :key='tag',
    :color='selectedTags.includes(tag) ? colors[tag] : undefined',
    @click='toggleTag(tag)'
  ) {{ tag }}
  v-chip.mx-1.my-1(
    dark,
    v-for='language in languages',
    :key='language',
    :color='selectedLanguages.includes(language) ? colors[language] : undefined',
    @click='toggleLanguage(language)'
  ) {{ language }}
  v-chip.mx-1.my-1(
    dark,
    v-for='nonlanguage in languages',
    :key='`no-${nonlanguage}`',
    :color='selectedNonlanguages.includes(nonlanguage) ? colors[nonlanguage] : undefined',
    @click='toggleNonlanguage(nonlanguage)'
  ) {{ $t("no") }} {{ nonlanguage }}
  v-chip.mx-1.my-1(
    dark,
    :color='newFilterEnabled ? "primary" : undefined',
    @click='toggleNewFilterEnabled'
  ) {{ $t("new") }}
  v-menu(offset-y)
    template(v-slot:activator='{ on }')
      v-btn.ml-2.mt-1(v-on='on', text, icon)
        v-icon keyboard_arrow_down
    v-list
      v-list-item(@click='markAllLocalizationsViewed')
        v-list-item-title Make all viewed
      v-list-item(@click='markAllLocalizationsNew')
        v-list-item-title Make all new
</template>

<script lang="ts">
import { ColorsMap } from '@/models/ColorsMap'
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const DataStore = namespace('DataStore')

@Component
export default class Filters extends Vue {
  @DataStore.State colors!: ColorsMap
  @DataStore.State tags!: string[]
  @DataStore.State languages!: string[]

  @DataStore.State selectedTags!: string[]
  @DataStore.State selectedLanguages!: string[]
  @DataStore.State selectedNonlanguages!: string[]

  @DataStore.State newFilterEnabled!: boolean

  @DataStore.Mutation toggleTag!: (tag: string) => void
  @DataStore.Mutation toggleLanguage!: (language: string) => void
  @DataStore.Mutation toggleNonlanguage!: (nonlanguage: string) => void
  @DataStore.Mutation markAllLocalizationsNew!: () => void
  @DataStore.Mutation markAllLocalizationsViewed!: () => void
  @DataStore.Mutation toggleNewFilterEnabled!: () => void
}
</script>
