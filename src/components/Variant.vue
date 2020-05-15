<template lang="pug">
  div
    .my-1
      .mr-2
        v-chip.px-1(
          x-small
          color='red'
          v-if='admin'
          @click='deleteVariant(variant, localization.key)'
          :loading='loading'
        )
          v-icon(x-small color='white') delete
        v-chip.px-1.mr-2(
          x-small
          color='green'
          v-if='admin'
          @click='selectVariant(variant, localization.key)'
          :loading='loading'
        )
          v-icon(x-small color='white') done
        v-chip.px-1(x-small) {{variant.language}}
        v-chip.px-1(x-small v-if='variant.username') {{variant.username.substr(0, 25)}}
        v-chip.px-1(x-small v-if='variant.createdAt') {{dateDisplay(variant.createdAt)}}
        v-chip.green.px-1(x-small v-if='variant.selected')
          v-icon(small color='white') done
        v-chip.px-2.ml-2(
          x-small
          :disabled='loading'
          @click='downvoteVariant(variant, localization.key)'
          :class='isDownvoted(variant._id) ? "red darken-2" : ""'
        ) {{loading ? '🤔' : '👎'}}{{variant.downvotes ? ` ${variant.downvotes}` : ''}}
        v-chip.px-2(
          x-small
          :disabled='loading'
          @click='upvoteVariant(variant, localization.key)'
          :class='isUpvoted(variant._id) ? "green darken-2" : ""'
        ) {{loading ? '🤔' : '👍'}}{{variant.upvotes ? ` ${variant.upvotes}` : ''}}
        v-chip.mx-2(
          x-small
          @click='commentsOpen = !commentsOpen'
          :class='commentsOpen ? "green darken-2" : ""'
        ) {{$t('comment.comments')}}{{variant.comments.length ? ` ${variant.comments.length}` : ''}}
      p.mb-0 {{variant.text.replace(/\n/gi, '\\n')}}
      Comments(
        v-if='commentsOpen'
        :variant='variant'
        :localizationKey='localization.key'
        :admin='admin'
      )
    v-divider
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { i18n } from '../plugins/i18n'
import * as store from '../plugins/store'
import * as api from '../utils/api'
import moment from 'moment'
import Comments from './Comments.vue'

@Component({
  props: {
    variant: Object,
    loadData: Function,
    admin: Boolean,
    localization: Object,
  },
  components: {
    Comments,
  },
})
export default class Variant extends Vue {
  loading = false
  commentsOpen = false

  async selectVariant(variant: any, key: string) {
    this.loading = true
    try {
      await api.selectVariant(key, variant._id, store.password())
      this.$props.loadData()
    } catch (err) {
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }

  async deleteVariant(variant: any, key: string) {
    this.loading = true
    try {
      await api.deleteVariant(key, variant._id, store.password())
      this.$props.loadData()
    } catch (err) {
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }

  dateDisplay(date: string) {
    return moment(date).format('L')
  }

  isUpvoted(id: string) {
    return store.upvoted()[id]
  }

  isDownvoted(id: string) {
    return store.downvoted()[id]
  }

  async upvoteVariant(variant: any, key: string) {
    this.loading = true
    try {
      if (this.isDownvoted(variant._id)) {
        await api.removeDownvoteVariant(key, variant._id)
        variant.downvotes--
        const downvoted = store.downvoted()
        delete downvoted[variant._id]
        store.setDownvoted(downvoted)
      }
      if (this.isUpvoted(variant._id)) {
        return
      }
      await api.upvoteVariant(key, variant._id)
      variant.upvotes++
      const upvoted = store.upvoted()
      upvoted[variant._id] = true
      store.setUpvoted(upvoted)
    } catch (err) {
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }

  async downvoteVariant(variant: any, key: string) {
    this.loading = true
    try {
      if (this.isUpvoted(variant._id)) {
        await api.removeUpvoteVariant(key, variant._id)
        variant.upvotes--
        const upvoted = store.upvoted()
        delete upvoted[variant._id]
        store.setUpvoted(upvoted)
      }
      if (this.isDownvoted(variant._id)) {
        return
      }
      await api.downvoteVariant(key, variant._id)
      variant.downvotes++
      const downvoted = store.downvoted()
      downvoted[variant._id] = true
      store.setDownvoted(downvoted)
    } catch (err) {
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }
}
</script>
