<template lang="pug">
.icon(@click='$emit("click")', :class='{ loading: loading }')
  slot
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    loading: Boolean
  }
})
export default class Icon extends Vue { }
</script>

<style lang="scss" scoped>
@import 'Icon';
</style>