import Vue from 'vue'
import Router from 'vue-router'
import Cats from '@/components/Cats.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Router)
Vue.use(BootstrapVue)
// Vue.use(Vuex)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'cats',
      component: Cats,
      // children: [
      //   {
      //     path: ':id',
      //     name: 'Modal',
      //     components: {
      //       rule: Modal
      //     },
      //     meta: {
      //       showModal: false
      //     }
      //   }
      // ]
    }
  ]
})
