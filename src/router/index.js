import Vue from 'vue'
import VueRouter from 'vue-router'
import FormWizard from '@/views/FormWizard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'start',
    component: FormWizard,
  },
]

const router = new VueRouter({
  routes,
})

export default router
