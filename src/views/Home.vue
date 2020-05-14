<template lang="pug">
  .v-container.pa-4
    .body-1 {{$t('description')}}
    UsernameInput
    SearchInput
    LocalizationCards
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import UsernameInput from '../components/UsernameInput.vue'
import SearchInput from '../components/SearchInput.vue'
import LocalizationCards from '../components/LocalizationCards.vue'

@Component({
  components: {
    UsernameInput,
    SearchInput,
    LocalizationCards,
  },
})
export default class Home extends Vue {}
</script>
