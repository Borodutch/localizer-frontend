<template lang="pug">
.contributors(v-if='contributors.length')
  .contributors__title {{ $t("top") }}
  .chips
    .chip(dark, v-for='contributor in contributors', :key='contributor.name') {{ contributor.name }}
      sup.font-bold.ml-1.text-text-silver {{ contributor.number }}
</template>

<script lang="ts">
import { Contributor } from '@/models/Contributor'
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const DataStore = namespace('DataStore')

@Component
export default class TopContributors extends Vue {
  @DataStore.State contributors!: Contributor[]
}
</script>
