<template lang="pug">
  .ml-4.mt-2
    v-textarea.mb-1.mt-0(
      rows='1'
      auto-grow
      no-resize
      compact
      v-model='text'
      :append-outer-icon="!!text ? 'send' : undefined"
      @click:append-outer='save'
      :disabled='loading'
    )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { i18n } from '../plugins/i18n'
import * as store from '../plugins/store'
import * as api from '../utils/api'
import moment from 'moment'

@Component({
  props: {
    variant: Object,
    localizationKey: String,
    closeEdit: Function,
  },
})
export default class Comments extends Vue {
  text = ''
  loading = false

  mounted() {
    this.text = this.$props.variant.text
  }

  async save() {
    this.loading = true
    try {
      await api.editVariant(
        this.$props.localizationKey,
        this.$props.variant._id,
        this.text
      )
      this.$props.variant.text = this.text
      this.$props.closeEdit()
    } catch (err) {
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }

  dateDisplay(date: string) {
    return moment(date).format('L')
  }

  async deleteVariantComment(comment: any) {
    this.loading = true
    try {
      await api.deleteCommentToVariant(
        this.$props.localizationKey,
        this.$props.variant._id,
        comment._id
      )
      this.$props.variant.comments = this.$props.variant.comments.filter(
        (c: any) => c._id !== comment._id
      )
    } catch (err) {
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }
}
</script>
