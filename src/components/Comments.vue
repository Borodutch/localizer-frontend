<template lang="pug">
.ml-4.mt-2
  .my-0(v-for='comment in variant.comments')
    div
      v-chip.px-1(
        dark,
        x-small,
        color='red',
        v-if='admin && !!comment._id',
        @click='deleteVariantComment(comment)',
        :loading='loading',
        :disabled='loading'
      )
        v-icon(x-small, color='white') delete
      v-chip.px-1(dark, x-small, v-if='comment.username') {{ comment.username }}
      v-chip.px-1(dark, x-small, v-if='comment.createdAt') {{ dateDisplay(comment.createdAt) }}
      v-chip.px-1(
        x-small,
        v-if='!$store.state.viewedItems[comment._id]',
        dark,
        @mouseover='setViewedItem(comment._id)',
        color='primary'
      ) {{ $t("new") }}
    p.ma-0 {{ comment.text }}
    v-divider
  v-textarea.mb-1.mt-0(
    :label='$t("comment.new")',
    clearable,
    rows='1',
    auto-grow,
    no-resize,
    compact,
    v-model='text',
    :append-outer-icon='!!text ? "send" : undefined',
    @click:append-outer='save',
    :disabled='loading'
  )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '@/utils/api'
import moment from 'moment'
import { namespace } from 'vuex-class'

const AppStore = namespace('AppStore')
const DataStore = namespace('DataStore')
const SnackbarStore = namespace('SnackbarStore')

@Component({
  props: {
    variant: Object,
    localizationKey: String,
    admin: Boolean,
  },
})
export default class Comments extends Vue {
  @AppStore.State username!: string

  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void
  @DataStore.Mutation setViewedItem!: (id: string) => void

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
        username: this.username,
        text: this.text,
        createdAt: new Date(),
      })
      this.text = ''
    } catch (err) {
      this.setSnackbarError(err.response.data)
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
      this.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }
}
</script>
