<template>
    <transition name="slide">
        <div class='user'>
            <div class="back" @click="back">
              <i class="fa fa-angle-left"></i>
            </div>
            <div class="switches-wrapper">
                <switches :switches="switches" @switch="switchItem" :currentIndex="currentIndex"></switches>
            </div>
            <div class="sequence-play">
                <i class="iconfont icon-bofangicon"></i>
                <span class="text">播放全部</span>
                <span class="count">(共{{count}}首)</span>
            </div>
            <div class="list-wrapper" ref="listWrapper">
                <scroll ref="favoriteList" class="list-scroll" :data="favoriteList">
                    <div class="list-inner">
                        <!-- 显示歌曲列表 -->
                        <song-list :songs="favoriteList"></song-list>
                    </div>
                </scroll>
                <scroll>
                    <div class="list-inner">
                        <song-list></song-list>
                    </div>
                </scroll>
            </div>
        </div>
    </transition>
</template>

<script>
import Scroll from '../../base/scroll/scroll.vue'
import Switches from '../../base/switches/switches'
import { mapGetters } from 'vuex'
import SongList from '../../base/song-list/song-list.vue'
export default {
  data () {
    return {
      currentIndex: 0,
      switches: [
        { name: '我的收藏' },
        { name: '最近播放' }
      ]
    }
  },
  computed: {
    count () {
      if (this.currentIndex === 0) {
        return this.favoriteList.length
      } else {
        return this.playHistory.length
      }
    },
    ...mapGetters([
      'favoriteList'
    ])
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    switchItem(index) {
      this.currentIndex = index
    }
  },
  components: {
    Scroll,
    Switches,
    SongList
  }
}
</script>
<style scoped>
.user {
    position: fixed;
    top:0;
    bottom:0;
    left:0;
    right:0;
    z-index:100;
    background:#F2F3F4;
}
.user .slide-enter-active{
    transition: all 0.3s
}
.user .slide-leave-active{
    transition: all 0.3s;
}
.user .slide-enter{
    transform: translate3d(-50%, 0, 0);
    opacity: 0;
}
.user .slide-leave-to{
    transform:translate3d(-50%,0,0);
    opacity: 0;
}
.back{
    position:absolute;
    top:0;
    left:4px;
}
.back .fa-angle-left{
    padding:5px 10px;
    font-size:30px;
    color: #fff;
}
.switches-wrapper{
  display:flex;
  align-items: center;
  background:rgb(212, 68, 57);
  height:44px;
}
</style>
