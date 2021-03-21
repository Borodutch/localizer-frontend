<template lang="pug">
main.wrapper
  .wrapper__inner
    LoadingBar(v-if='loading')
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

<style lang="scss">
.code {
  @apply p-5 bg-back-gray rounded-2xl text-sm text-text-dark overflow-y-scroll mb-10;
}

.dark {
  & .code {
    @apply bg-text-dark text-white;
  }
}
</style>
