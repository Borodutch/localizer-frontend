<template lang="pug">
  v-card.mb-2
    v-card-title
      v-btn.mr-1(
        v-if='admin'
        color='red'
        small
        icon
        @click='deleteLocalization(localization.key)'
        :loading='loading'
      )
        v-icon(small) delete
      v-btn.mr-1(
        v-if='!edit'
        small
        icon
        @click='edit = true'
      )
        v-icon(small) add
      v-btn.mr-1(
        v-else
        small
        icon
        @click='edit = false'
        color='red'
      )
        v-icon(small) clear
      span.mx-1 {{localization.key}}
      v-chip.mx-1(
        small
        v-for='tag in localization.tags'
        :key='tag'
      ) {{tag}}
    v-card-text
      div(v-if='edit')
        v-textarea.mb-1.mt-0.pt-0(
          :label='$t("add.text")'
          clearable
          rows='1'
          :rules='textRules'
          auto-grow
          no-resize
          compact
          v-model='text'
        )
        .d-flex
          v-select.mb-1.mt-0.pt-0(
            :label='$t("add.language")'
            :items='languages'
            :rules='languageRules'
            v-model='language'
          )
          v-btn.ml-2(
            color='primary'
            :disabled='!text || !language'
            @click='save(localization.key)'
            :loading='loading'
          ) {{$t("add.save")}}
      .div(v-for='variant in localization.variants')
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
              v-if='variant.selected'
              :disabled='loading'
              @click='downvoteVariant(variant, localization.key)'
              :class='isDownvoted(variant._id) ? "red darken-2" : ""'
            ) {{loading ? '🤔' : '👎'}}{{variant.downvotes ? ` ${variant.downvotes}` : ''}}
            v-chip.px-2(
              x-small
              v-if='variant.selected'
              :disabled='loading'
              @click='upvoteVariant(variant, localization.key)'
              :class='isUpvoted(variant._id) ? "green darken-2" : ""'
            ) {{loading ? '🤔' : '👍'}}{{variant.upvotes ? ` ${variant.upvotes}` : ''}}
          p.mb-0.align-self-center {{variant.text.replace(/\n/gi, '\\n')}}
        v-divider
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as store from '../plugins/store'
import { i18n } from '../plugins/i18n'
import * as api from '../utils/api'
import moment from 'moment'

@Component({
  props: {
    localization: Object,
    languages: Array,
    loadData: Function,
    admin: Boolean,
  },
})
export default class LocalizationCard extends Vue {
  text = ''
  language = ''

  edit = false

  textRules = [(v: any) => !!(v || '').trim() || i18n.t('errors.textLength')]
  languageRules = [(v: any) => !!(v || '').trim() || i18n.t('errors.language')]

  loading = false

  async save(key: string) {
    this.loading = true
    try {
      await api.postVariant(key, this.text, this.language, store.username())
      this.$props.loadData()
      this.text = ''
      this.edit = false
    } catch (err) {
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }

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

  async deleteLocalization(key: string) {
    this.loading = true
    try {
      await api.deleteLocalization(key, store.password())
      this.$props.loadData()
    } catch (err) {
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
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

  dateDisplay(date: string) {
    return moment(date).format('L')
  }

  isUpvoted(id: string) {
    return store.upvoted()[id]
  }

  isDownvoted(id: string) {
    return store.downvoted()[id]
  }
}
</script>
