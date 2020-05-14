<template lang="pug">
  div
    v-card.mb-2(v-for='localization in data' :key='localization.key')
      v-card-title
        v-btn.mr-1(
          v-if='admin'
          color=red
          small
          icon
          @click='deleteLocalization(localization.key)'
          :loading='loading'
        )
          v-icon(small) delete
        v-btn.mr-1(
          v-if='!addKeys.includes(localization.key)'
          small
          icon
          @click='addKeys = [localization.key]'
        )
          v-icon(small) add
        v-btn.mr-1(
          v-else
          small
          icon
          @click='addKeys = []'
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
        div(v-if='addKeys.includes(localization.key)')
          v-select.mb-1.mt-0.pt-0(
            :label='$t("add.language")'
            :items='languages'
            :rules='languageRules'
            v-model='language'
          )
          .d-flex
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
                @click='select(variant, localization.key)'
                :loading='loading'
              )
                v-icon(x-small color='white') done
              v-chip.px-1(x-small) {{variant.language}}
              v-chip.px-1(x-small v-if='variant.username') {{variant.username.substr(0, 25)}}
              v-chip.green.px-1(x-small v-if='variant.selected')
                v-icon(small color='white') done
            p.mb-0.align-self-center {{variant.text}}
          v-divider
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as store from '../plugins/store'
import * as api from '../utils/api'
import { i18n } from '../plugins/i18n'
import { Watch } from 'vue-property-decorator'

@Component({
  props: {
    admin: Boolean,
  },
})
export default class LocalizationCards extends Vue {
  data = [] as any[]
  addKeys = []
  @Watch('addKeys')
  onAddKeysChange() {
    this.text = ''
  }
  languages = [] as any[]

  language = ''
  text = ''

  loading = false

  mounted() {
    this.loadData()
  }

  textRules = [(v: any) => !!(v || '').trim() || i18n.t('errors.textLength')]
  languageRules = [(v: any) => !!(v || '').trim() || i18n.t('errors.language')]

  async loadData() {
    try {
      const data = await api.getLocalizations()
      this.data = data
      this.data.forEach((l: any) => {
        l.variants = l.variants.sort((a: any, b: any) => {
          if (a.selected && !b.selected) {
            return -1
          } else if (!a.selected && b.selected) {
            return 1
          } else {
            return 0
          }
        })
      })
      const languages = new Set<string>()
      for (const localization of data) {
        for (const l of localization.variants.map((v: any) => v.language)) {
          languages.add(l)
        }
      }
      this.languages = Array.from(languages)
    } catch (err) {
      store.setSnackbarError(err.response.data)
    }
  }

  async save(key: string) {
    this.loading = true
    try {
      await api.postVariant(key, this.text, this.language, store.username())
      this.addKeys = []
      this.loadData()
    } catch (err) {
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }

  async select(variant: any, key: string) {
    this.loading = true
    try {
      await api.selectVariant(key, variant._id, store.password())
      this.addKeys = []
      this.loadData()
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
      this.addKeys = []
      this.loadData()
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
      this.addKeys = []
      this.loadData()
    } catch (err) {
      store.setSnackbarError(err.response.data)
    } finally {
      this.loading = false
    }
  }
}
</script>
