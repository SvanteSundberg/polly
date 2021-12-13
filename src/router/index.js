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
  path: '/pollID/:lang',
  name: 'PollID',
  component: () => import(/* webpackChunkName: "about" */ '../views/pollID.vue')
},
    {
    path: '/poll/:id/:lang/:user',
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
    path: '/result/:id:/:lang',
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
    path: '/selectQuestions/:id/:lang',
    name: 'SelectQuestions',
    component: () => import(/* webpackChunkName: "about" */ '../views/selectQuestions.vue')
  },
  {
    path: '/creatorPoll/:id/:lang',
    name: 'CreatorPoll',
    component: () => import(/* webpackChunkName: "about" */ '../views/CreatorPoll.vue')
  },

  {
  path: '/waitingRoom/:id/:lang/',
  name: 'WaitingRoom',
  component: () => import(/* webpackChunkName: "about" */ '../views/WaitingRoom.vue')
  },

  {
  path: '/editID/:lang/',
  name: 'EditID',
  component: () => import(/* webpackChunkName: "about" */ '../views/EditID.vue')
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
