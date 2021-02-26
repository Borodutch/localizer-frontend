import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Code from '@/views/Code.vue'
import NotFound from '@/views/NotFound.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/code',
      name: 'code',
      component: Code,
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound,
    },
  ],
})

export default router
