<template lang="pug">
cookie-law(
  theme='blood-orange',
  :buttonText='$t("cookie.button")',
  :message='$t("cookie.message")'
)
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CookieLaw from 'vue-cookie-law'

@Component({
  components: { CookieLaw },
})
export default class CookieMessage extends Vue {}
</script>
