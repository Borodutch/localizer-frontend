<template lang="pug">
.card__comments
  .comment(v-for='comment in variant.comments')
    .comment__head
      .chips.chips--margin
        .card__icon(v-if='isAdmin', @click='deleteVariantComment(comment)')
          img(src='../assets/icons/close.svg') 
        .chip.chip--title.chip--flat(v-if='comment.username') {{ comment.username }}
        .chip.chip--title.chip--flat(v-if='comment.createdAt') {{ dateDisplay(comment.createdAt) }}
        .chip.chip--new(
          v-if='!viewedItems[comment._id]',
          @click='setViewedProxy(comment._id)'
        ) {{ $t("new") }}
    .comment__body {{ comment.text }}
  .input-group.input-group--clear
    input.input(
      type='text',
      :placeholder='$t("comment.new")',
      v-model='commentText'
    )
    .button(v-if='commentText && username', @click='save') {{ $t("add.save") }}
    .button.button--inactive(v-else) {{ $t("add.save") }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '@/utils/api'
import moment from 'moment'
import { namespace } from 'vuex-class'
import { Variant } from '@/models/Variant'
import { Comment } from '@/models/Comment'
import { ViewedItems } from '@/models/ViewedItems'

const AppStore = namespace('AppStore')
const DataStore = namespace('DataStore')
const SnackbarStore = namespace('SnackbarStore')

@Component({
  props: {
    variant: Object,
    localizationKey: String,
  },
})
export default class Comments extends Vue {
  @AppStore.State username!: string
  @AppStore.State isAdmin!: string
  @DataStore.State viewedItems!: ViewedItems

  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void
  @DataStore.Mutation addComment!: (options: {
    key: string
    variant: Variant
    comment: Comment
  }) => void
  @DataStore.Mutation deleteComment!: (options: {
    key: string
    variant: Variant
    comment: Comment
  }) => void
  @DataStore.Mutation setViewedItem!: (id: string) => void
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
      this.setViewedItem(comment._id)
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

  async deleteVariantComment(comment: Comment) {
    const key = this.$props.localizationKey
    const variant = this.$props.variant

    this.performRequest(async () => {
      await api.deleteCommentToVariant(key, variant._id, comment._id)
      this.deleteComment({
        key,
        variant,
        comment,
      })
      this.refreshLocalizations()
    })
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

  setViewedProxy(id: string) {
    this.setViewedItem(id)
    this.refreshLocalizations()
  }
}
</script>
