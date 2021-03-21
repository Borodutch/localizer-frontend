<template lang="pug">
.mt-5.flex.flex-col
  Textarea(v-model='text', rows=5)
  Button(huge, @click='save', :inactive='!text', :loading='loading') Send
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '@/utils/api'
import moment from 'moment'
import { namespace } from 'vuex-class'
import { Variant } from '@/models/Variant'

const SnackbarStore = namespace('SnackbarStore')
const DataStore = namespace('DataStore')

@Component({
  props: {
    variant: Object,
    localizationKey: String,
    closeEditText: Function,
  },
})
export default class Comments extends Vue {
  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void
  @DataStore.Mutation changeVariantText!: (options: {
    key: string
    variant: Variant
    text: string
  }) => void

  text = ''
  loading = false

  mounted() {
    this.text = this.$props.variant.text
  }

  async save() {
    const key = this.$props.localizationKey
    const variant = this.$props.variant
    this.loading = true
    try {
      await api.editVariant(key, variant._id, this.text)
      this.changeVariantText({ key, variant, text: this.text })
      this.$props.closeEditText()
    } catch (err) {
      this.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }

  dateDisplay(date: string) {
    return moment(date).format('L')
  }
}
</script>
