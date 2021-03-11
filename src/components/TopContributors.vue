<template lang="pug">
.my-10.p-5.bg-additional-blue.rounded-lg.text-center.shadow-blue(
  v-if='contributors.length'
)
  .font-bold.mb-2.text-primary-blue.text-lg {{ $t("top") }}
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
