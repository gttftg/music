<template>
  <div id="app">
    <!-- 顶部 -->
    <m-header></m-header>
    <!-- 导航栏 -->
    <tab></tab>
    <!-- 使用keep-alive包裹动态组件时，会缓存不活动的组件实例 -->
    <keep-alive>
      <!-- 将路由规则中匹配到的组件展示到<router-view>中 -->
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import mHeaderVue from './components/m-header/m-header.vue'
import tabVue from './components/tab/tab.vue'
import Player from './components/player/player.vue'
export default {
  components: {
    'm-header': mHeaderVue,
    tab: tabVue,
    Player
  }
}
</script>

<style>
@import './common/css/index.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
