<template lang="pug">
//- v-text-field(
//-   :append-icon='show ? "mdi-eye" : "mdi-eye-off"',
//-   :label='$t("admin.password")',
//-   v-model='passwordProxy',
//-   :type='show ? "text" : "password"',
//-   @click:append='show = !show'
//- )
<input class="password-text" type="password" :placeholder='$t("admin.password")'/>
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

<style lang="scss" scoped>
.password-text {
  @apply font-medium transition block p-4 pl-12 w-full rounded-lg border-back-silver focus:border-primary-blue focus:ring-0 placeholder-text-light;
}
.password-text {
  background-image: url('../assets/icons/key.svg');
  background-repeat: no-repeat;
  background-position: 14px center;
  background-size: 24px;
  font-size: 20px;
}
</style>
