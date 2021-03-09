<template lang="pug">
main.wrapper
  .wrapper__inner
    .greeting-text {{ $t("description") }}
    .page-block
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

<style lang="scss">
.wrapper {
  @apply px-5;

  &__inner {
    @apply max-w-screen-xl mx-auto;
  }
}
.greeting-text {
  @apply font-medium py-10;
}
.greeting-text {
  font-size: 22px;
}
.page-block {
  @apply pb-5;
}
</style>
