<template lang="pug">
.button(
  @click='$emit("click")',
  :class='{ "button--inactive": inactive, loading: loading }'
)
  slot
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    inactive: Boolean,
    loading: Boolean
  }
})
export default class Button extends Vue { }
</script>

<style lang="scss" scoped>
@import 'Button';
</style>