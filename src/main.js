import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'

// 阻止显示生产模式
Vue.config.productionTip = false

// 懒加载图片,该段一般用于main.js中
Vue.use(VueLazyload, {
  loading: require('./common/image/default.png')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
