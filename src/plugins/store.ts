import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export interface State {
  snackbar: SnackbarState
  language?: String
  dark: Boolean
  username?: String
  query?: String
  password?: String
  tags: String[]
  languages: String[]
  nonlanguages: String[]
  upvoted: Object
  downvoted: Object
  colors: Object
}

interface LocalizedError {
  en: string
  ru: string
}

interface SnackbarState {
  message: String | LocalizedError
  active: Boolean
  color: String
}

const storeOptions = {
  state: {
    snackbar: {
      message: '',
      active: false,
      color: 'success',
    },
    language: undefined,
    dark: true,
    username: undefined,
    query: undefined,
    password: undefined,
    tags: [],
    languages: [],
    nonlanguages: [],
    upvoted: {},
    downvoted: {},
    colors: {},
  },
  mutations: {
    setSnackbar(state: State, snackbar: SnackbarState) {
      state.snackbar = snackbar
    },
    setLanguage(state: State, language: String) {
      state.language = language
    },
    setDark(state: State, dark: Boolean) {
      state.dark = dark
    },
    setUsername(state: State, username: String | undefined) {
      state.username = username
    },
    setQuery(state: State, query: String | undefined) {
      state.query = query
    },
    setPassword(state: State, password: String | undefined) {
      state.password = password
    },
    setTags(state: State, tags: String[]) {
      state.tags = tags
    },
    setLanguages(state: State, languages: String[]) {
      state.languages = languages
    },
    setNonlanguages(state: State, nonlanguages: String[]) {
      state.nonlanguages = nonlanguages
    },
    setUpvoted(state: State, upvoted: Object) {
      state.upvoted = upvoted
    },
    setDownvoted(state: State, downvoted: Object) {
      state.downvoted = downvoted
    },
    setColors(state: State, colors: Object) {
      state.colors = colors
    },
  },
  getters: {
    snackbar: (state: State) => state.snackbar,
    language: (state: State) => state.language,
    dark: (state: State) => state.dark,
    username: (state: State) => state.username,
    query: (state: State) => state.query,
    password: (state: State) => state.password,
    tags: (state: State) => state.tags,
    languages: (state: State) => state.languages,
    nonlanguages: (state: State) => state.nonlanguages,
    upvoted: (state: State) => state.upvoted,
    downvoted: (state: State) => state.downvoted,
    colors: (state: State) => state.colors,
  },
  plugins: [
    createPersistedState({
      paths: [
        'username',
        'language',
        'dark',
        'password',
        'tags',
        'languages',
        'nonlanguages',
        'upvoted',
        'downvoted',
      ],
    }),
  ],
}

export const store = new Vuex.Store<State>(storeOptions)

// Getters
const getters = store.getters

export const snackbar = () => getters.snackbar as SnackbarState
export const language = () => getters.language as string | undefined
export const dark = () => getters.dark as boolean
export const username = () => getters.username as string | undefined
export const query = () => getters.query as string | undefined
export const password = () => getters.password as string | undefined
export const tags = () => getters.tags as string[]
export const languages = () => getters.languages as string[]
export const nonlanguages = () => getters.nonlanguages as string[]
export const upvoted = () => getters.upvoted as { [index: string]: boolean }
export const downvoted = () => getters.downvoted as { [index: string]: boolean }
export const colors = () => getters.downvoted as { [index: string]: string }

// Mutations
export const setSnackbar = (snackbar: SnackbarState) => {
  store.commit('setSnackbar', snackbar)
}
export const setSnackbarError = (message: String) => {
  setSnackbar({
    message,
    color: 'error',
    active: true,
  })
}
export const hideSnackbar = () => {
  store.commit('setSnackbar', { ...store.state.snackbar, active: false })
}
export const setLanguage = (language: String) => {
  store.commit('setLanguage', language)
}
export const setDark = (dark: Boolean) => {
  store.commit('setDark', dark)
}
export const setUsername = (username: String | undefined) => {
  store.commit('setUsername', username)
}
export const setQuery = (query: String | undefined) => {
  store.commit('setQuery', query)
}
export const setPassword = (password: String | undefined) => {
  store.commit('setPassword', password)
}
export const setTags = (tags: String[]) => {
  store.commit('setTags', tags)
}
export const setLanguages = (languages: String[]) => {
  store.commit('setLanguages', languages)
}
export const setNonlanguages = (nonlanguages: String[]) => {
  store.commit('setNonlanguages', nonlanguages)
}
export const setUpvoted = (upvoted: Object) => {
  store.commit('setUpvoted', upvoted)
}
export const setDownvoted = (downvoted: Object) => {
  store.commit('setDownvoted', downvoted)
}
export const setColors = (colors: Object) => {
  store.commit('setColors', colors)
}
