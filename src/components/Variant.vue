<template lang="pug">
div(style='width: 100%')
  .my-1
    .mr-2
      v-chip.px-1(
        dark,
        x-small,
        color='red',
        v-if='isAdmin && !selectOrDeleteVariantsEnabled',
        @click='deleteVariant',
        :loading='loading'
      )
        v-icon(x-small, color='white') delete
      //- v-chip.px-1(
      //-   dark,
      //-   x-small,
      //-   color='green',
      //-   v-if='admin && !select',
      //-   @click='selectVariant(variant, localization.key)',
      //-   :loading='loading'
      //- )
      //-   v-icon(x-small, color='white') done
      //- v-chip.px-1.mr-2(
      //-   dark,
      //-   x-small,
      //-   v-if='admin',
      //-   @click='edit = !edit',
      //-   :class='edit ? "green darken-2" : ""',
      //-   :loading='loading'
      //- )
      //-   v-icon(x-small, color='white') edit
      v-chip.px-1(dark, x-small, :color='colors[variant.language]') {{ variant.language }}
      v-chip.px-1(dark, x-small, v-if='variant.username') {{ variant.username.substr(0, 25) }}
      v-chip.px-1(dark, x-small, v-if='variant.createdAt') {{ dateDisplay(variant.createdAt) }}
      v-chip.green.px-1(dark, x-small, v-if='variant.selected')
        v-icon(small, color='white') done
      v-chip.px-2.ml-2(
        x-small,
        :disabled='loading',
        @click='downvote',
        :class='this.downvoted[variant._id] ? "red darken-2" : ""'
      ) {{ loading ? "🤔" : "👎" }}{{ variant.downvotes ? ` ${variant.downvotes}` : "" }}
      v-chip.px-2(
        dark,
        x-small,
        :disabled='loading',
        @click='upvote',
        :class='this.upvoted[variant._id] ? "green darken-2" : ""'
      ) {{ loading ? "🤔" : "👍" }}{{ variant.upvotes ? ` ${variant.upvotes}` : "" }}
      //- v-chip.mx-2(
      //-   dark,
      //-   x-small,
      //-   @click='commentsOpen = !commentsOpen',
      //-   :class='commentsOpen ? "green darken-2" : hasNewComments(variant) ? "primary" : ""'
      //- ) {{ $t("comment.comments") }}{{ variant.comments.length ? ` ${variant.comments.length}` : "" }}{{ hasNewComments(variant) ? `, ${$t("new")}` : "" }}
      //- v-chip.px-1(
      //-   x-small,
      //-   v-if='!$store.state.viewedItems[variant._id]',
      //-   dark,
      //-   @mouseover='setViewedItem(variant._id)',
      //-   color='primary'
      //- ) {{ $t("new") }}
    p.mb-0 {{ variant.text.replace(/\n/gi, "\\n") }}
    //- EditVariant(
    //-   v-if='edit',
    //-   :variant='variant',
    //-   :localizationKey='localization.key',
    //-   :closeEdit='closeEdit'
    //- )
    //- Comments(
    //-   v-if='commentsOpen',
    //-   :variant='variant',
    //-   :localizationKey='localization.key',
    //-   :admin='admin'
    //- )
  v-divider
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '@/utils/api'
import moment from 'moment'
// import Comments from '@/components/Comments.vue'
// import EditVariant from '@/components/EditVariant.vue'
import { namespace } from 'vuex-class'
import { ColorsMap } from '@/models/ColorsMap'

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
    // Comments,
    // EditVariant,
  },
})
export default class Variant extends Vue {
  @DataStore.State upvoted!: { [index: string]: boolean }
  @DataStore.State downvoted!: { [index: string]: boolean }
  // @DataStore.State viewedItems!: { [index: string]: boolean }

  // @DataStore.Mutation setUpvoted!: (upvoted: Object) => void
  // @DataStore.Mutation setDownvoted!: (upvoted: Object) => void
  // @DataStore.Mutation setViewedItem!: (id: string) => void
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
  @DataStore.Mutation refreshLocalizations!: () => void

  @DataStore.State colors!: ColorsMap
  @AppStore.State isAdmin!: boolean

  loading = false
  // commentsOpen = false
  // edit = false

  // async selectVariant(variant: any, key: string) {
  //   this.loading = true
  //   try {
  //     await api.selectVariant(key, variant._id)
  //     this.$props.loadData()
  //   } catch (err) {
  //     this.setSnackbarError(err.response.data)
  //   } finally {
  //     this.loading = false
  //   }
  // }

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

  // closeEdit() {
  //   this.edit = false
  // }

  // hasNewComments(variant: any) {
  //   const viewedItems = this.viewedItems
  //   for (const comment of variant.comments) {
  //     if (!viewedItems[comment._id]) {
  //       return true
  //     }
  //   }
  //   return false
  // }

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
