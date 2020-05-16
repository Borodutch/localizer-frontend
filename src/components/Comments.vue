<template lang="pug">
  .ml-4.mt-2
    .my-0(v-for='comment in variant.comments')
      div
        v-chip.px-1(
          dark
          x-small
          color='red'
          v-if='admin && !!comment._id'
          @click='deleteVariantComment(comment)'
          :loading='loading'
          :disabled='loading'
        )
          v-icon(x-small color='white') delete
        v-chip.px-1(
          dark
          x-small
          v-if='comment.username'
        ) {{comment.username}}
        v-chip.px-1(
          dark
          x-small
          v-if='comment.createdAt'
        ) {{dateDisplay(comment.createdAt)}}
        v-chip.px-1(
          x-small
          v-if='!$store.state.viewedItems[comment._id]'
          dark
          @mouseover='setViewedItem(comment._id)'
          color='primary'
        ) {{$t('new')}}
      p.ma-0 {{comment.text}}
      v-divider
    v-textarea.mb-1.mt-0(
      :label='$t("comment.new")'
      clearable
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
    admin: Boolean,
  },
})
export default class Comments extends Vue {
  text = ''
  loading = false

  async save() {
    this.loading = true
    try {
      await api.leaveCommentToVariant(
        this.text,
        this.$props.localizationKey,
        this.$props.variant._id
      )
      this.$props.variant.comments.push({
        username: store.username(),
        text: this.text,
        createdAt: new Date(),
      })
      this.text = ''
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

  setViewedItem(id: string) {
    store.setViewedItem(id)
  }
}
</script>
