<template lang="pug">
main.wrapper
  .greeting-text {{ $t("description") }}
  UsernameInput
  PasswordInput(v-if='isAdmin')
  SearchInput
  LocalizationCards
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import UsernameInput from '@/components/UsernameInput.vue'
import SearchInput from '@/components/SearchInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import LocalizationCards from '@/components/LocalizationCards.vue'
import { namespace } from 'vuex-class'

const AppStore = namespace('AppStore')

@Component({
  components: {
    UsernameInput,
    SearchInput,
    PasswordInput,
    LocalizationCards,
  },
})
export default class Home extends Vue {
  @AppStore.State isAdmin!: boolean
}
</script>

<style lang="scss" scoped>
.wrapper {
  @apply max-w-screen-xl mx-auto;
}
.greeting-text {
  @apply font-medium;
}
</style>
