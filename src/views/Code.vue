<template lang="pug">
  .v-container.pa-4
    v-progress-linear.mb-4(
      v-if='loading'
      indeterminate
    )
    code {{data}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '../utils/api'
import * as store from '../plugins/store'

@Component
export default class Code extends Vue {
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
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }
}
</script>
