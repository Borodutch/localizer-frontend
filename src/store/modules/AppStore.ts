import { VuexModule, Module, Mutation } from 'vuex-module-decorators'

@Module({ namespaced: true, name: 'AppStore' })
export default class AppStore extends VuexModule {
  language: string = ''
  dark = false
  username: string = ''
  query: string = ''
  password: string = ''
  newFilterOn: boolean = false

  @Mutation
  setLanguage(language: string) {
    this.language = language
  }

  @Mutation
  setDark(dark: boolean) {
    this.dark = dark
  }

  @Mutation
  setUsername(username: string) {
    this.username = username
  }

  @Mutation
  setQuery(query: string) {
    this.query = query
  }

  @Mutation
  setPassword(password: string) {
    this.password = password
  }

  @Mutation
  setNewFilterOn(newFilterOn: boolean) {
    this.newFilterOn = newFilterOn
  }
}
