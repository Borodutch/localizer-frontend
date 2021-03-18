<template lang="pug">
.mb-4(v-if='loading') loading
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
