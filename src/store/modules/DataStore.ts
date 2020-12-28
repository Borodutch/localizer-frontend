import { VuexModule, Module, Mutation } from 'vuex-module-decorators'

@Module({ namespaced: true, name: 'DataStore' })
export default class DataStore extends VuexModule {
  colors: Object = {}
  tags: string[] = []
  languages: string[] = []
  nonlanguages: string[] = []
  upvoted: Object = {}
  downvoted: Object = {}
  viewedItems: Object = {}

  @Mutation
  setColors(colors: Object) {
    this.colors = colors
  }

  @Mutation
  setTags(tags: string[]) {
    this.tags = tags
  }

  @Mutation
  setLanguages(languages: string[]) {
    this.languages = languages
  }

  @Mutation
  setNonlanguages(nonlanguages: string[]) {
    this.nonlanguages = nonlanguages
  }

  @Mutation
  setUpvoted(upvoted: Object) {
    this.upvoted = upvoted
  }

  @Mutation
  setDownvoted(downvoted: Object) {
    this.downvoted = downvoted
  }

  @Mutation
  setViewedItems(viewedItems: Object) {
    this.viewedItems = viewedItems
  }

  setViewedItem(id: string) {
    const change = {} as any
    change[id] = true
    this.setViewedItems({ ...this.viewedItems, ...change })
  }
}
