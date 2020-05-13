<template lang="pug">
  v-text-field(
    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    :label="$t('admin.password')"
    v-model='password'
    :type='show ? "text" : "password"'
    @click:append="show = !show"
  )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as store from '../plugins/store'

@Component
export default class PasswordInput extends Vue {
  show = false

  get password() {
    return store.password()
  }
  set password(newPassword: string | undefined) {
    store.setPassword(newPassword)
  }
}
</script>
