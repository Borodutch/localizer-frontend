<template lang="pug">
.chip(
  :class='{ loading: loading, "chip--selected": selected, "chip--new": isNew, "chip--sm": small, "chip--dashed": dashed, "chip--flat": flat, "chip--inactive": inactive }',
  :style='selected && color ? `background-color: ${color}` : ""',
  @click='$emit("click")'
)
  slot
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    small: Boolean,
    flat: Boolean,
    isNew: Boolean,
    selected: Boolean,
    inactive: Boolean,
    loading: Boolean,
    dashed: Boolean,
    color: String
  }
})
export default class Chip extends Vue { }
</script>

<style lang="scss">
@import 'Chip';
</style>