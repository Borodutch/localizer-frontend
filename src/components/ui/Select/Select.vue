<template lang="pug">
.select(v-click-outside='hide', :class='{ "select--opened": opened }')
  .select__placeholder(
    @click='toggleDrop',
    :class='{ "select__placeholder--selected": currentItem }'
  )
    span {{ currentItem ? currentItem : $props.label }}
    img(v-if='opened', src='@/assets/icons/up.svg', width=20)
    img(v-else, src='@/assets/icons/down.svg', width=20)
  transition(name='fade')
    .select__drop(v-if='opened')
      .select__item(v-for='item in $props.items', @click='setItem(item)') {{ item }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ClickOutside from 'vue-click-outside'

@Component({
  props: {
    items: Array,
    label: String
  },
  directives: {
    ClickOutside
  }
})
export default class Select extends Vue {
  opened = false;
  currentItem = ''

  toggleDrop() {
    this.opened = !this.opened
  }

  hide() {
    this.opened = false
  }

  setItem(item: string) {
    this.currentItem = item
    this.$emit('click', item)
    this.hide()
  }
}
</script>

<style lang="scss" scoped>
@import 'Select';
</style>