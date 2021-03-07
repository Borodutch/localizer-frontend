import Vue from 'vue'
import Vuetify, {
  VApp,
  VAppBar,
  VToolbarTitle,
  VSpacer,
  VBtn,
  VIcon,
  VMenu,
  VList,
  VListItem,
  VListItemTitle,
  VFlex,
  VLayout,
  VSnackbar,
  VMain,
  VTextField,
  VChip,
  VProgressLinear,
  VPagination,
  VCardText,
  VCardTitle,
  VCard,
  VContainer,
  VDivider,
} from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, {
  components: {
    VApp,
    VAppBar,
    VToolbarTitle,
    VSpacer,
    VBtn,
    VIcon,
    VMenu,
    VList,
    VListItem,
    VListItemTitle,
    VFlex,
    VLayout,
    VSnackbar,
    VMain,
    VTextField,
    VChip,
    VProgressLinear,
    VPagination,
    VCardText,
    VCardTitle,
    VCard,
    VContainer,
    VDivider,
  },
})

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
})
