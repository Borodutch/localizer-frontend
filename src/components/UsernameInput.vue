<template lang="pug">
input.input.user-text(
  type='text',
  :placeholder='$t("username")',
  v-model='usernameProxy'
)
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const AppStore = namespace('AppStore')

@Component
export default class UsernameInput extends Vue {
  @AppStore.State username!: string
  @AppStore.Mutation setUsername!: (username: string) => void

  get usernameProxy() {
    return this.username
  }

  set usernameProxy(newUsername: string) {
    this.setUsername(newUsername)
  }

}
</script>
