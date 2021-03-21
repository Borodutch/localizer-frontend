<template lang="pug">
.icon(
  @click='inactive || loading ? "" : $emit("click")',
  :class='{ loading: loading, "icon--inactive": inactive }'
)
  slot
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    loading: Boolean,
    inactive: Boolean
  }
})
export default class Icon extends Vue { }
</script>

<style lang="scss">
@import 'Icon';
</style>