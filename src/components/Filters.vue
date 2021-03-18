<template lang="pug">
.chips
  .chip(
    v-for='tag in tags',
    :key='tag',
    :style='selectedTags.includes(tag) ? "background-color: " + colors[tag] : ""',
    :class='selectedTags.includes(tag) ? "chip--selected" : ""',
    @click='toggleTag(tag)'
  ) {{ tag }}
  .chip(
    v-for='language in languages',
    :key='language',
    :style='selectedLanguages.includes(language) ? "background-color: " + colors[language] : ""',
    :class='selectedLanguages.includes(language) ? "chip--selected" : ""',
    @click='toggleLanguage(language)'
  ) {{ language }}
  .chip(
    v-for='nonlanguage in languages',
    :key='`no-${nonlanguage}`',
    :style='selectedNonlanguages.includes(nonlanguage) ? "background-color: " + colors[nonlanguage] : ""',
    :class='selectedNonlanguages.includes(nonlanguage) ? "chip--selected" : ""',
    @click='toggleNonlanguage(nonlanguage)'
  ) {{ $t("no") }} {{ nonlanguage }}
  .chip(
    :class='newFilterEnabled ? "chip--flat-new" : ""',
    @click='toggleNewFilterEnabled'
  ) {{ $t("new") }}
  .chip.chip--dashed(@click='markAllLocalizationsViewed') Make all viewed
  .chip.chip--dashed(@click='markAllLocalizationsNew') Make all new
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