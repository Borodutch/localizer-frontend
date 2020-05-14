<template lang="pug">
  div.mb-2
    v-chip.mx-1(
      v-for='tag in tags'
      :key='tag'
      :color='tagsSelected.indexOf(tag) > -1 ? "primary" : ""'
      @click='toggleTag(tag)'
    ) {{tag}}
    v-chip.mx-1(
      v-for='language in languages'
      :key='language'
      :color='languagesSelected.indexOf(language) > -1 ? "primary" : ""'
      @click='toggleLanguage(language)'
    ) {{language}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as store from '../plugins/store'
import { Watch } from 'vue-property-decorator'

@Component({
  props: {
    languages: Array,
    tags: Array,
    setTagFilter: Function,
    setLanguageFilter: Function,
  },
})
export default class Filters extends Vue {
  tagsSelected = [] as any[]
  @Watch('tagsSelected')
  tagsSelectedChanged(newVal: any) {
    this.$props.setTagFilter(newVal)
  }
  languagesSelected = [] as any[]
  @Watch('languagesSelected')
  languagesSelectedChanged(newVal: any) {
    this.$props.setLanguageFilter(newVal)
  }

  mounted() {
    this.tagsSelected = this.$props.tags
    this.languagesSelected = this.$props.languages
  }

  toggleTag(tag: string) {
    if (this.tagsSelected.indexOf(tag) > -1) {
      this.tagsSelected = this.tagsSelected.filter((t) => t !== tag)
    } else {
      this.tagsSelected.push(tag)
    }
  }

  toggleLanguage(language: string) {
    if (this.languagesSelected.indexOf(language) > -1) {
      this.languagesSelected = this.languagesSelected.filter(
        (t) => t !== language
      )
    } else {
      this.languagesSelected.push(language)
    }
  }
}
</script>
