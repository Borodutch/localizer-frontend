import { VuexModule, Module, Mutation } from 'vuex-module-decorators'

@Module({ namespaced: true, name: 'AppStore' })
export default class AppStore extends VuexModule {
  language: string = ''
  dark = false
  isAdmin = false

  username: string = ''
  password: string = ''

  @Mutation
  setLanguage(language: string) {
    this.language = language
  }

  @Mutation
  setDark(dark: boolean) {
    this.dark = dark
  }
  @Mutation
  toggleAdmin() {
    this.isAdmin = !this.isAdmin
  }

  @Mutation
  setUsername(username: string) {
    this.username = username
  }

  @Mutation
  setPassword(password: string) {
    this.password = password
  }
}
