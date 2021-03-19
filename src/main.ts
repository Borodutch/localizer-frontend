import Vue from 'vue'
import App from '@/App.vue'
import router from '@/plugins/router'
import store from '@/store'
import { i18n } from '@/plugins/i18n'

import Chip from '@/components/ui/Chip/Chip.vue'

import '@/index.css'
import '@/styles/main.scss'

Vue.config.productionTip = true
Vue.component('Chip', Chip)

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
