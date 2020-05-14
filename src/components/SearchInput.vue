<template lang="pug">
  v-text-field.my-0.py-0(
    :label="$t('search')"
    v-model='query'
    append-icon='search'
  )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as store from '../plugins/store'

@Component
export default class SearchInput extends Vue {
  get query() {
    return store.query()
  }
  set query(newQuery: string | undefined) {
    store.setQuery(newQuery)
  }
}
</script>
