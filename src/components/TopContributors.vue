<template lang="pug">
.mt-4(v-if='contributors.length')
  .headline.mb-2 {{ $t("top") }}
  v-chip.mx-1.my-1(
    dark,
    v-for='contributor in contributors',
    :key='contributor.name'
  ) {{ contributor.name }} {{ contributor.number }}
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
