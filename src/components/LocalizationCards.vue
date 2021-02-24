<template lang="pug">
div
  LoadingIndicator
  Filters
  Pagination
  //- LocalizationCard(
  //-   v-for='localization in filteredData',
  //-   :key='localization.key',
  //-   :localization='localization'
  //- )
  Pagination
  TopContributors
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
// import LocalizationCard from '@/components/LocalizationCard.vue'
import TopContributors from '@/components/TopContributors.vue'
import Filters from '@/components/Filters.vue'
import Pagination from '@/components/Pagination.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import { namespace } from 'vuex-class'
import { Localization } from '@/models/Localization'

const DataStore = namespace('DataStore')

@Component({
  components: {
    // LocalizationCard,
    Filters,
    TopContributors,
    Pagination,
    LoadingIndicator,
  },
})
export default class LocalizationCards extends Vue {
  @DataStore.Getter filteredAndPaginatedData!: Localization[]
  @DataStore.Action loadData!: () => void

  mounted() {
    this.loadData()
  }
}
</script>
