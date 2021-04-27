import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 重复调用路由
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  // 配置路由匹配规则
  {
    path: '/',
    // 重定向：根目录转到/recommend
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import('../views/recommend/recommend.vue'),
    children: [{
      // 不能添加/,以/开头的嵌套路径会被当成根路径
      path: ':id',
      component: () => import('../views/music-list/music-list')
    }]
  },
  {
    path: '/singer',
    name: 'Singer',
    component: () => import('../views/singer/singer.vue'),
    children: [{
      path: ':id',
      component: () => import('../views/singer-detail/singer-detail.vue')
    }]
  },
  // {
  //   path: '/rank',
  //   name: 'Rank',
  //   component: () => import('../views/rank/rank.vue')
  // },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/user/user.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/search/search.vue'),
    children: [
      {
        path: 'singer/:id',
        component: () => import('../views/singer-detail/singer-detail.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
