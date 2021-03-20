<template lang="pug">
.text-center
  .lds-ellipsis
    div
    div
    div
    div
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class LoadingBar extends Vue { }
</script>

<style lang="scss">
@import 'LoadingBar';
</style>