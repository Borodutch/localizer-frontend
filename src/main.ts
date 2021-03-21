import Vue from 'vue'
import App from '@/App.vue'
import router from '@/plugins/router'
import store from '@/store'
import { i18n } from '@/plugins/i18n'

import Chip from '@/components/ui/Chip/Chip.vue'
import Button from '@/components/ui/Button/Button.vue'
import Icon from '@/components/ui/Icon/Icon.vue'
import LoadingBar from '@/components/ui/LoadingBar/LoadingBar.vue'
import Input from '@/components/ui/Input/Input.vue'
import Textarea from '@/components/ui/Textarea/Textarea.vue'
import Dropdown from '@/components/ui/Dropdown/Dropdown.vue'
import Select from '@/components/ui/Select/Select.vue'

import '@/tailwind.css'
import '@/styles/main.scss'

Vue.config.productionTip = true

Vue.component('Chip', Chip)
Vue.component('Button', Button)
Vue.component('Icon', Icon)
Vue.component('LoadingBar', LoadingBar)
Vue.component('Input', Input)
Vue.component('Textarea', Textarea)
Vue.component('Dropdown', Dropdown)
Vue.component('Select', Select)

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
