<template lang="pug">
  div.mt-4(v-if='contributors.length')
    .headline.mb-2 {{$t('top')}}
    v-chip.mx-1.my-1(
      dark
      v-for='contributor in contributors'
      :key='contributor.name'
    ) {{contributor.name}} {{contributor.number}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    contributors: Array,
  },
})
export default class TopContributors extends Vue {}
</script>
