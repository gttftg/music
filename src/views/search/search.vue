<template>
<!-- 动画 -->
    <transition name="search">
        <div class='search' ref='searchWrapper'>
            <div class="search-box-wrapper">
                <!-- 点击图标具有返回效果 -->
                <i class="fa fa-angle-left" @click="back"></i>
                <!-- 子组件向父组件传值 -->
                <search-box @query="onQueryChange" ref="searchBox"></search-box>
            </div>
            <scroll class="search-scroll-wrapper" ref="scroll" :pullup="pullup" @scrollToEnd="searchMore">
                <div ref="search">
                    <!-- v-show作用是添加判断,是否display  -->
                    <div class="search-hots" v-show="!query">
                        <p class="title">热门搜索</p>
                        <span v-for="item in hots" :key="item.id" @click="addQuery(item.first)">
                          {{item.first}}
                        </span>
                    </div>
                    <!-- 搜索历史 -->
                    <div class="shortcut-wrapper" v-show="!query">
                        <!-- 这里的searchHistory哪里来的？searchHistory.length为空，则display:none -->
                        <div class="search-history" v-show="searchHistory.length">
                            <h1 class="title">
                              <span class='text'>搜索历史</span>
                              <!-- 添加点击函数,判断是否清空 -->
                              <span class="clear" @click="showConfirm">
                                <i class='icon-clear'></i>
                              </span>
                            </h1>
                            <!-- 显示搜索历史的内容,searches是searchHistory的内容 -->
                            <search-list :searches="searchHistory" @delete="deleteSearchHistory" @select="addQuery"></search-list>
                        </div>
                    </div>
                    <!-- 显示搜索后的页面,refresh具有滚动刷新的效果 -->
                    <div class="search-result">
                      <suggest :query="query" ref="suggest" @refresh="refresh" @select="saveSearch"></suggest>
                    </div>
                </div>
            </scroll>
            <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空历史记录？" confirmBtnText='清空'></confirm>
            <router-view></router-view>
        </div>
    </transition>
</template>

<script>
import SearchBox from '../../base/search-box/search-box'
import Scroll from '../../base/scroll/scroll'
import SearchList from '../../base/search-list/search-list'
import Suggest from '../../views/suggest/suggest'
import { getSearchHot } from '../../api/search'
import { mapGetters, mapActions } from 'vuex'
import Confirm from '../../base/confirm/confirm'

export default {
  data () {
    return {
      hots: [],
      pullup: true,
      query: ''
    }
  },
  created () {
    this._getSearchHot()
  },
  methods: {
    back () {
      // 相当于back()
      this.$router.go(-1)
      // searchBox.query是搜索内容
      this.$refs.searchBox.clear()
    },
    // 显示删除
    showConfirm() {
      this.$refs.confirm.show()
    },
    // 获取搜索的热点
    _getSearchHot () {
      getSearchHot().then((res) => {
        this.hots = res.data.result.hots
      })
    },
    // this.query,query是子组件带来的参数值
    // query是表单中搜索内容
    onQueryChange(query) {
      this.query = query
    },
    // 点击热门搜索里的内容，就加入到query中
    addQuery(query) {
      // 获取searchBox里的函数setQuery
      this.$refs.searchBox.setQuery(query)
    },
    searchMore() {
      this.$refs.suggest.searchMore()
    },
    refresh () {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    },
    // 将搜索内容保存到good-storage
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory', 'clearSearchHistory'])
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  components: {
    SearchBox,
    Scroll,
    SearchList,
    Suggest,
    Confirm
  }
}

</script>
<style scoped>
/* 页面进来时有动画效果 */
.search-enter-active, .search-leave-active {
  transition: all 0.3s;
}
.search-enter, .search-leave-to {
  transform: translate3d(50%, 0, 0);
  opacity: 0;
}
.search {
    /* 生成绝对定位的元素，相对于浏览器窗口进行定位 */
    position: fixed;
    z-index: 100;
    width:100%;
    top:0;
    bottom:0;
    background: #F2F3F4;
}
.search .search-box-wrapper{
    padding:10px 40px 10px 43px;
    background: rgb(212, 68, 57);
}
.search .search-box-wrapper .fa{
    position: absolute;
    top:5px;
    left:3px;
    font-size: 30px;
    padding: 3px 10px;
    color: #fff;
}
.search .search-scroll-wrapper{
    height: 100%;
    overflow: hidden;
}
.search .search-scroll-wrapper .search-hots{
    margin: 0 20px;
}
.search .search-scroll-wrapper .search-hots .title{
    height:30px;
    line-height: 30px;
    color:#757575;
    font-size:12px;
    text-align: left;
    padding: 15px 0px 10px 5px;
}

.search .search-scroll-wrapper .search-hots span{
    display: inline-block;
    border: 0.8px solid #c7c7c7;
    border-radius: 5px;
    line-height: 20px;
    color:#2E3030;
    font-size: 14px;
    padding:3px 3px;
    margin: 4px 2px;
}
.search .search-scroll-wrapper .shortcut-wrapper{
    position: relative;
    margin: 10px auto;
}
.search .search-scroll-wrapper .shortcut-wrapper .search-history{
    position: relative;
    margin: 10px 25px;
}
.search .search-scroll-wrapper .shortcut-wrapper .search-history .title{
    display: flex;
    align-items: center;
    height: 30px;
    font-size:12px;
    color:#757575;
}
.search .search-scroll-wrapper .shortcut-wrapper .search-history .clear{
    position: relative;
}
.search .search-scroll-wrapper .shortcut-wrapper .search-history .clear:before{
    content: '';
    position: absolute;
}
.search .search-scroll-wrapper .shortcut-wrapper .search-history .clear .icon-clear{
    font-size:14px;
    color:#2E3030;
}
.search .search-result{
  position:relative;
  width:100%;
  top:10px;
  bottom:0;
}
.router-view
{
  z-index:1000;
}
</style>
