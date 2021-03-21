<template lang="pug">
.variant
  .variant__actions
    .variant__icons(v-if='isAdmin && !selectOrDeleteVariantsEnabled')
      Icon(
        v-if='isAdmin && !selectOrDeleteVariantsEnabled',
        :loading='loading',
        @click='deleteVariant'
      )
        img(src='../assets/icons/close.svg') 
      Icon(
        v-if='isAdmin && !selectOrDeleteVariantsEnabled && !variant.selected',
        :loading='loading',
        @click='selectVariant'
      )
        img(src='../assets/icons/done.svg', width=26) 
      Icon(
        v-if='isAdmin && !selectOrDeleteVariantsEnabled',
        @click='editTextEnabled = !editTextEnabled',
        :loading='loading'
      )
        img(src='../assets/icons/edit.svg') 
    .flex.items-center.space-x-2.flex-wrap
      Chip(:color='colors[variant.language]', selected, small, inactive) {{ variant.language }}
      Chip(v-if='variant.username', small, flat, inactive) {{ variant.username.substr(0, 25) }}
      Chip(v-if='variant.createdAt', small, flat, inactive) {{ dateDisplay(variant.createdAt) }}
      Chip(
        isNew,
        small,
        v-if='!viewedItems[variant._id]',
        @click='setViewedProxy'
      ) {{ $t("new") }}
      Icon(inactive, v-if='variant.selected')
        img(src='../assets/icons/done.svg', width=26)
    .variant__ratings
      Icon(@click='downvote', :loading='loading') 
        img(
          v-if='this.downvoted[variant._id]',
          src='../assets/icons/down-active.svg',
          width=26
        ) 
        img(v-else, src='../assets/icons/down.svg', width=26) 
        span.card__icon-text(v-if='!!variant.downvotes') {{ variant.downvotes ? ` ${variant.downvotes}` : "" }}
      Icon(@click='upvote', :loading='loading') 
        img(
          v-if='this.upvoted[variant._id]',
          src='../assets/icons/up-active.svg',
          width=26
        ) 
        img(v-else, src='../assets/icons/up.svg', width=26) 
        span(v-if='!!variant.upvotes') {{ variant.upvotes ? ` ${variant.upvotes}` : "" }}
    .variant__link(
      @click='commentsOpen = !commentsOpen',
      :class='commentsOpen ? "variant__link--active" : ""'
    ) {{ $t("comment.comments") }}{{ variant.comments.length ? ` ${variant.comments.length}` : "" }}{{ hasNewComments(variant) ? `, ${$t("new")}` : "" }}
  .variant__content {{ variant.text.replace(/\n/gi, "\\n") }}
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
    selected: Boolean,
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

<style lang="scss" scoped>
.variant {
  @apply w-full;

  &__actions {
    @apply flex;
    @apply flex-wrap;
    @apply items-center;

    & > * {
      @apply pt-2;
      @apply pr-3;
      @apply md_pt-0;
    }
  }

  &__icons {
    @apply flex;
    @apply items-center;
    @apply place-self-start;
    @apply space-x-1;
  }

  &__ratings {
    @apply flex;
    @apply items-center;
    @apply space-x-2;
    @apply mx-3;
    @apply ml-0;
    @apply md_ml-3;
  }

  &__content {
    @apply pt-5;
    @apply font-medium;
    @apply text-text-silver;
  }

  &__link {
    @apply transition;
    @apply font-medium;
    @apply text-text-silver;
    @apply cursor-pointer;
    @apply hover_text-primary-blue;

    &--active {
      @apply text-primary-blue;
    }
  }
}
</style>
