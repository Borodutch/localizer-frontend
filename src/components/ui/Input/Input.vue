<template lang="pug">
input.input(
  :type='type ? type : "text"',
  :class='icon ? `input--${icon}` : ""',
  :value='value',
  :placeholder='$props.label',
  @input='handleInput($event.target.value)'
)
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    value: String,
    label: String,
    icon: String,
    type: String
  }
})
export default class Input extends Vue {
  handleInput(val: String) {
    this.$emit('input', val)
  }
}
</script>

<style lang="scss" scoped>
@import 'Input';
</style>