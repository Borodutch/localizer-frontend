<template lang="pug">
.dropdown
  .dropdown__text(
    @click='toggleDrop',
    v-click-outside='hide',
    :class='{ "dropdown__text--selected": opened }'
  ) {{ $props.label }}
    transition(name='fade')
      .dropdown__menu(v-if='opened')
        .dropdown__item(
          v-for='item in $props.items',
          @click='$emit("click", item)'
        ) {{ item }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ClickOutside from 'vue-click-outside'

@Component({
  props: {
    flat: Boolean,
    items: Array,
    label: String,
  },
  directives: {
    ClickOutside
  }
})
export default class Dropdown extends Vue {
  opened = false;

  toggleDrop() {
    this.opened = !this.opened
  }

  hide() {
    this.opened = false
  }

}
</script>

<style lang="scss" scoped>
@import 'Dropdown';
</style>