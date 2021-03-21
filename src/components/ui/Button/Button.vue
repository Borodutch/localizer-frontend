<template lang="pug">
.button(
  @click='inactive || loading ? "" : $emit("click")',
  :class='{ "button--inactive": inactive, loading: loading, "button--huge": huge }'
)
  slot
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    inactive: Boolean,
    loading: Boolean,
    huge: Boolean
  }
})
export default class Button extends Vue { }
</script>

<style lang="scss">
@import 'Button';
</style>