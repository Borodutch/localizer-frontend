<template lang="pug">
  .v-container.pa-4
    .headline {{$t('admin.title')}}
    .body-1 {{$t('admin.description')}}
    PasswordInput
</template>

<script lang="ts">
import Vue from 'vue'
import * as store from '../plugins/store'
import Component from 'vue-class-component'
import { i18n } from '../plugins/i18n'
import PasswordInput from '../components/PasswordInput.vue'

@Component({
  components: {
    PasswordInput,
  },
})
export default class Admin extends Vue {}
</script>
