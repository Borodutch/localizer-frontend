<template lang="pug">
//- v-text-field(:label='$t("search")', v-model='queryProxy', append-icon='search')
<input class="search-text" type="text" :placeholder="$t('search')" v-model='queryProxy' />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const DataStore = namespace('DataStore')

@Component
export default class SearchInput extends Vue {
  @DataStore.State query!: string

  @DataStore.Mutation setQuery!: (query: string) => void

  get queryProxy() {
    return this.query
  }
  set queryProxy(newQuery: string) {
    this.setQuery(newQuery)
  }
}
</script>

<style lang="scss" scoped>
.search-text {
  @apply font-medium transition block p-4 pl-12 w-full rounded-lg border-back-silver focus:border-primary-blue focus:ring-0 placeholder-text-light;
}
.search-text {
  background-image: url('../assets/icons/search.svg');
  background-repeat: no-repeat;
  background-position: 13px center;
  background-size: 25px;
  font-size: 20px;
}
</style>
