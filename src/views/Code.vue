<template lang="pug">
main.wrapper
  .wrapper__inner
    .text-center.text-3xl.font-bold.text-text-dark.animate-bounce(
      v-if='loading'
    ) Loading...
    .code(v-if='data') 
      pre {{ data }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '@/utils/api'
import { namespace } from 'vuex-class'

const SnackbarStore = namespace('SnackbarStore')

@Component
export default class Code extends Vue {
  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void

  loading = false
  data = ''

  mounted() {
    this.loadData()
  }

  async loadData() {
    this.loading = true
    try {
      const data = await api.getLocalizations()
      this.data = JSON.stringify(data, undefined, 2)
    } catch (err) {
      this.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }
}
</script>
