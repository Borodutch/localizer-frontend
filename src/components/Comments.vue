<template lang="pug">
.ml-4.mt-2
  .my-0(v-for='comment in variant.comments')
    div
      v-chip.px-1(
        dark,
        x-small,
        color='red',
        v-if='isAdmin',
        @click='deleteVariantComment(comment)',
        :loading='loading',
        :disabled='loading'
      )
        v-icon(x-small, color='white') delete
      v-chip.px-1(dark, x-small, v-if='comment.username') {{ comment.username }}
      v-chip.px-1(dark, x-small, v-if='comment.createdAt') {{ dateDisplay(comment.createdAt) }}
      //- v-chip.px-1(
      //-   x-small,
      //-   v-if='!$store.state.viewedItems[comment._id]',
      //-   dark,
      //-   @mouseover='setViewedItem(comment._id)',
      //-   color='primary'
      //- ) {{ $t("new") }}
    p.ma-0 {{ comment.text }}
    v-divider
  v-textarea.mb-1.mt-0(
    :label='$t("comment.new")',
    clearable,
    rows='1',
    auto-grow,
    no-resize,
    compact,
    v-model='commentText',
    :append-outer-icon='!!commentText ? "send" : undefined',
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
import { Variant } from '@/models/Variant'
import { Comment } from '@/models/Comment'

const AppStore = namespace('AppStore')
const DataStore = namespace('DataStore')
const SnackbarStore = namespace('SnackbarStore')

// TODO: viewed items

@Component({
  props: {
    variant: Object,
    localizationKey: String,
  },
})
export default class Comments extends Vue {
  @AppStore.State username!: string
  @DataStore.State isAdmin!: string

  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void
  @DataStore.Mutation addComment!: (options: {
    key: string
    variant: Variant
    comment: Comment
  }) => void
  // @DataStore.Mutation setViewedItem!: (id: string) => void
  @DataStore.Mutation refreshLocalizations!: () => void

  commentText = ''
  loading = false

  save() {
    const key = this.$props.localizationKey
    const variant = this.$props.variant

    this.performRequest(async () => {
      const comment = await api.leaveCommentToVariant(
        this.commentText,
        key,
        variant._id
      )
      this.addComment({
        key,
        variant,
        comment,
      })
      this.refreshLocalizations()
      this.commentText = ''
    })
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

  async performRequest(requestFunction: () => Promise<unknown>) {
    this.loading = true
    try {
      await requestFunction()
    } catch (err) {
      console.error(err)
      this.setSnackbarError(err.response?.data || JSON.stringify(err))
    } finally {
      this.loading = false
    }
  }
}
</script>
