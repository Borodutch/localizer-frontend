import { Localization } from '@/models/Localization'
import { VuexModule, Module, MutationAction } from 'vuex-module-decorators'
import * as api from '@/utils/api'
const randomColor = require('randomcolor')

@Module({ namespaced: true, name: 'DataStore' })
export default class DataStore extends VuexModule {
  localizations: Localization[] = []
  colors: Object = {}
  tags: string[] = []
  languages: string[] = []

  upvoted: Object = {}
  downvoted: Object = {}
  viewedItems: Object = {}

  loading = false

  @MutationAction({ mutate: ['localizations', 'colors', 'tags', 'languages'] })
  async loadData() {
    this.loading = true
    try {
      // Get localizations
      const localizations = await api.getLocalizations()
      // Get languages and tags
      const languages = new Set<string>()
      const tags = new Set<string>()
      for (const localization of localizations) {
        for (const l of localization.variants.map((v: any) => v.language)) {
          languages.add(l)
        }
        for (const tag of localization.tags) {
          tags.add(tag)
        }
      }
      // Get colors
      const colors = {} as any
      const names = new Set([...tags, ...languages])
      for (const name of names) {
        colors[name] = randomColor({ luminosity: 'dark', seed: name })
      }
      // Return result
      return {
        localizations,
        colors,
        tags,
        languages,
      }
    } catch (err) {
      console.error(err)
      return {
        localizations: [],
        colors: {},
        tags: [],
        languages: [],
      }
    } finally {
      this.loading = false
    }
  }
}
