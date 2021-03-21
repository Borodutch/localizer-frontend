<template lang="pug">
textarea.textarea(
  :value='value',
  @input='handleInput($event.target.value)',
  :rows='rows ? rows : 1'
)
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    value: String,
    label: String,
    rows: Number
  }
})
export default class Textarea extends Vue {
  handleInput(val: String) {
    this.$emit('input', val)
  }
}
</script>

<style lang="scss" scoped>
@import 'Textarea';
</style>