<template lang="pug">
.flex.items-center
  .title-text {{ $t("notFound") }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class NotFound extends Vue { }
</script>

<style scoped>
.title-text {
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 60px;
  line-height: 72px;
  color: #28282c;
  text-align: center;
  margin: 40px 0px;
}
@media only screen and (max-width: 800px) {
  .title-text {
    font-size: 35px;
    line-height: 40px;
    margin: 30px 0px;
  }
}
@media only screen and (max-width: 400px) {
  .title-text {
    font-size: 25px;
    line-height: 30px;
    margin: 30px 0px;
  }
}
.theme--dark .title-text {
  color: #e0e0e0;
}
</style>
