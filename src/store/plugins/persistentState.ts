import createPersistedState from 'vuex-persistedstate'

export default createPersistedState({
  paths: [
    'AppStore.language',
    'AppStore.dark',
    'AppStore.username',
    'AppStore.password',
    'AppStore.query',
    'AppStore.newFilterOn',
  ],
})
