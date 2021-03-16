<template lang="pug">
div(style='width: 100%')
  .card__actions
    .card__icons(v-if='isAdmin')
      .card__icon(
        v-if='isAdmin && !selectOrDeleteVariantsEnabled',
        @click='deleteVariant'
      )
        img(src='../assets/icons/close.svg') 
      .card__icon(
        v-if='isAdmin && !selectOrDeleteVariantsEnabled && !variant.selected',
        @click='selectVariant'
      )
        img(src='../assets/icons/done.svg', width=26) 
      .card__icon(
        v-if='isAdmin && !selectOrDeleteVariantsEnabled',
        @click='editTextEnabled = !editTextEnabled',
        :class='editTextEnabled ? "green darken-2" : ""'
      )
        img(src='../assets/icons/edit.svg') 
    .chips
      .chip.chip--title.chip--selected.text-white(
        :style='"background-color:" + colors[variant.language]'
      ) {{ variant.language }}
      .chip.chip--title.chip--flat(v-if='variant.username') {{ variant.username.substr(0, 25) }}
      .chip.chip--title.chip--flat(v-if='variant.createdAt') {{ dateDisplay(variant.createdAt) }}
      .chip.chip--new(
        v-if='!viewedItems[variant._id]',
        @click='setViewedProxy'
      ) {{ $t("new") }}
      .card__icon.card__icon--inactive(v-if='variant.selected')
        img(src='../assets/icons/done.svg', width=26)
    .card__ratings
      .card__icon(
        :disabled='loading',
        @click='downvote',
        :class='this.downvoted[variant._id] ? "red darken-2" : ""'
      ) 
        //- {{ loading ? "🤔" : "👎" }}{{ variant.downvotes ? ` ${variant.downvotes}` : "" }}
        img(src='../assets/icons/down.svg', width=26) 
      .card__icon(
        @click='upvote',
        :class='this.upvoted[variant._id] ? "green darken-2" : ""'
      ) 
        //- {{ loading ? "🤔" : "👍" }}{{ variant.upvotes ? ` ${variant.upvotes}` : "" }}
        img(src='../assets/icons/up.svg', width=26) 
    .card__link(
      @click='commentsOpen = !commentsOpen',
      :class='commentsOpen ? "card__link--active" : ""'
    ) {{ $t("comment.comments") }}{{ variant.comments.length ? ` ${variant.comments.length}` : "" }}{{ hasNewComments(variant) ? `, ${$t("new")}` : "" }}
  .card__content {{ variant.text.replace(/\n/gi, "\\n") }}
  EditVariant(
    v-if='editTextEnabled',
    :variant='variant',
    :localizationKey='localization.key',
    :closeEditText='() => { editTextEnabled = false; }'
  )
  Comments(
    v-if='commentsOpen',
    :variant='variant',
    :localizationKey='localization.key'
  )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '@/utils/api'
import moment from 'moment'
import Comments from '@/components/Comments.vue'
import EditVariant from '@/components/EditVariant.vue'
import { namespace } from 'vuex-class'
import { ColorsMap } from '@/models/ColorsMap'
import { ViewedItems } from '@/models/ViewedItems'

const SnackbarStore = namespace('SnackbarStore')
const DataStore = namespace('DataStore')
const AppStore = namespace('AppStore')

@Component({
  props: {
    variant: Object,
    localization: Object,
    selectOrDeleteVariantsEnabled: Boolean,
  },
  components: {
    Comments,
    EditVariant,
  },
})
export default class Variant extends Vue {
  @DataStore.State upvoted!: { [index: string]: boolean }
  @DataStore.State downvoted!: { [index: string]: boolean }
  @DataStore.State viewedItems!: ViewedItems

  @DataStore.Mutation setViewedItem!: (id: string) => void
  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void
  @DataStore.Mutation deleteLocalizationVariant!: (options: {
    key: string
    variant: Variant
  }) => void
  @DataStore.Mutation toggleUpvote!: (options: {
    key: string
    variant: Variant
  }) => void
  @DataStore.Mutation toggleDownvote!: (options: {
    key: string
    variant: Variant
  }) => void
  @DataStore.Mutation selectLocalizationVariant!: (options: {
    key: string
    variant: Variant
  }) => void
  @DataStore.Mutation refreshLocalizations!: () => void

  @DataStore.State colors!: ColorsMap
  @AppStore.State isAdmin!: boolean

  loading = false
  commentsOpen = false
  editTextEnabled = false

  async selectVariant() {
    const key = this.$props.localization.key
    const variant = this.$props.variant
    this.performRequest(async () => {
      await api.selectVariant(key, variant._id)
      this.selectLocalizationVariant({ key, variant })
      this.refreshLocalizations()
    })
  }

  async deleteVariant() {
    const key = this.$props.localization.key
    const variant = this.$props.variant
    this.performRequest(async () => {
      await api.deleteVariant(key, variant._id)
      this.deleteLocalizationVariant({ key, variant })
      this.refreshLocalizations()
    })
  }

  dateDisplay(date: string) {
    return moment(date).format('L')
  }

  async upvote() {
    const key = this.$props.localization.key
    const variant = this.$props.variant
    const upvoted = this.upvoted[variant._id]

    this.performRequest(async () => {
      if (upvoted) {
        await api.removeUpvoteVariant(key, variant._id)
      } else {
        await api.upvoteVariant(key, variant._id)
      }
      this.toggleUpvote({ key, variant })
    })
  }

  async downvote() {
    const key = this.$props.localization.key
    const variant = this.$props.variant
    const downvoted = this.downvoted[variant._id]

    this.performRequest(async () => {
      if (downvoted) {
        await api.removeDownvoteVariant(key, variant._id)
      } else {
        await api.downvoteVariant(key, variant._id)
      }
      this.toggleDownvote({ key, variant })
    })
  }

  hasNewComments(variant: any) {
    for (const comment of variant.comments) {
      if (!this.viewedItems[comment._id]) {
        return true
      }
    }
    return false
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

  setViewedProxy() {
    this.setViewedItem(this.$props.variant._id)
    this.refreshLocalizations()
  }
}
</script>
