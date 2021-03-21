<template lang="pug">
.flex.flex-wrap.items-center
  Chip(
    v-for='tag in tags',
    :key='tag',
    :selected='selectedTags.includes(tag)',
    :color='colors[tag]',
    @click='toggleTag(tag)'
  ) {{ tag }}
  Chip(
    v-for='language in languages',
    :key='language',
    :color='colors[language]',
    :selected='selectedLanguages.includes(language)',
    @click='toggleLanguage(language)'
  ) {{ language }}
  Chip(
    v-for='nonlanguage in languages',
    :key='`no-${nonlanguage}`',
    :color='colors[nonlanguage]',
    :selected='selectedNonlanguages.includes(nonlanguage)',
    @click='toggleNonlanguage(nonlanguage)'
  ) {{ $t("no") }} {{ nonlanguage }}
  Chip(:isNew='newFilterEnabled', @click='toggleNewFilterEnabled') {{ $t("new") }}
  Chip(isNew, @click='markAllLocalizationsViewed') Make all viewed
  Chip(isNew, @click='markAllLocalizationsNew') Make all new
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