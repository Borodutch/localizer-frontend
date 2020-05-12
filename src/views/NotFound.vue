<template lang="pug">
  .v-container.pa-4
    .d-flex.justify-center
      .headline.pb-4 {{$t('notFound')}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class NotFound extends Vue {}
</script>
