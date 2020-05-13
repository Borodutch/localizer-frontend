<template lang="pug">
  v-text-field(
    :label="$t('username')"
    v-model='username'
  )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as store from '../plugins/store'

@Component
export default class UsernameInput extends Vue {
  get username() {
    return store.username()
  }
  set username(newUsername: string | undefined) {
    store.setUsername(newUsername)
  }
}
</script>
