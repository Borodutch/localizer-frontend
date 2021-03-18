<template lang="pug">
.text-center.text-3xl.font-bold.text-text-dark.animate-bounce(v-if='loading') Loading...
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const DataStore = namespace('DataStore')

@Component
export default class LoadingIndicator extends Vue {
  @DataStore.State loading!: boolean
}
</script>
