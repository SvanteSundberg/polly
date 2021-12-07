import { createRouter, createWebHashHistory } from 'vue-router'
import Start from '../views/Start.vue'

const routes = [
  {
    path: '/',
    name: 'Start',
    component: Start
  },

  {
    path: '/createID/:lang',
    name: 'createID',
    component: () => import(/* webpackChunkName: "about" */ '../views/createID.vue')
  },
  {
  path: '/pollID',
  name: 'PollID',
  component: () => import(/* webpackChunkName: "about" */ '../views/pollID.vue')
},
    {
    path: '/poll/:id',
    name: 'Poll',
    component: () => import(/* webpackChunkName: "about" */ '../views/Poll.vue')
  },
  {
    path: '/create/:id/:lang',
    name: 'Create',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Create.vue')
  },
  {
    path: '/result/:id',
    name: 'Result',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Result.vue')
  },

  {
    path: '/selectTheme/:id/:lang',
    name: 'SelectTheme',
    component: () => import(/* webpackChunkName: "about" */ '../views/SelectTheme.vue')
  },
  {
    path: '/selectQuestions/:id',
    name: 'SelectQuestions',
    component: () => import(/* webpackChunkName: "about" */ '../views/selectQuestions.vue')
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
