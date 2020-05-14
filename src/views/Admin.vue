<template lang="pug">
  .v-container.pa-4
    .headline {{$t('admin.title')}}
    .body-1 {{$t('admin.description')}}
    PasswordInput
    SearchInput
    LocalizationCards(admin)
</template>

<script lang="ts">
import Vue from 'vue'
import * as store from '../plugins/store'
import Component from 'vue-class-component'
import { i18n } from '../plugins/i18n'
import PasswordInput from '../components/PasswordInput.vue'
import SearchInput from '../components/SearchInput.vue'
import LocalizationCards from '../components/LocalizationCards.vue'

@Component({
  components: {
    PasswordInput,
    LocalizationCards,
    SearchInput,
  },
})
export default class Admin extends Vue {}
</script>
