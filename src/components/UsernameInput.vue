<template lang="pug">
//- v-text-field(:label='$t("username")', v-model='usernameProxy')
<input class="user-text" type="text" :placeholder='$t("username")' v-model='usernameProxy'/>
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

<style lang="scss" scoped>
.user-text {
  @apply font-medium transition block p-4 pl-12 w-full rounded-lg border-back-silver focus:border-primary-blue focus:ring-0 placeholder-text-light;
}
.user-text {
  background-image: url('../assets/icons/smile.svg');
  background-repeat: no-repeat;
  background-position: 14px center;
  background-size: 20px;
  font-size: 20px;
}
</style>
