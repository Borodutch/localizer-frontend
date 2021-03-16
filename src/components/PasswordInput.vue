<template lang="pug">
input.input.password-text(
  v-model='passwordProxy',
  type='password',
  :placeholder='$t("admin.password")'
)
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const AppStore = namespace('AppStore')

@Component
export default class PasswordInput extends Vue {
  @AppStore.State password!: string
  @AppStore.Mutation setPassword!: (password: string) => void

  show = false

  get passwordProxy() {
    return this.password
  }

  set passwordProxy(newPassword: string) {
    this.setPassword(newPassword)
  }

}
</script>
