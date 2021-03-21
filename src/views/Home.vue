<template lang="pug">
main.wrapper
  .wrapper__inner
    .greeting-text {{ $t("description") }}
    .pt-5.space-y-3
      .grid.gap-3(:class='isAdmin ? "grid-cols-2" : "grid-cols-1"')
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
.greeting-text {
  @apply font-medium pb-6 pt-4 md_pb-10 md_pt-8 text-text-dark text-xl md_text-2xl;
}

.dark {
  & .greeting-text {
    @apply text-text-milk;
  }
}
</style>