import createPersistedState from 'vuex-persistedstate'

export default createPersistedState({
  paths: [
    'AppStore.language',
    'AppStore.dark',
    'AppStore.isAdmin',
    'AppStore.username',
    'AppStore.password',

    'DataStore.selectedTags',
    'DataStore.selectedLanguages',
    'DataStore.selectedNonlanguages',
    'DataStore.newFilterEnabled',

    'DataStore.upvoted',
    'DataStore.downvoted',
    'DataStore.viewedItems',
  ],
})
