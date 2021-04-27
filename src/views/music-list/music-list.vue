<template>
   <transition name="slide" mode="out-in">
       <div class="music-list">
           <div class="header" ref="header">
                <!-- 返回箭头 -->
                <div class="back" @click="back">
                    <i class="fa fa-angle-left"></i>
                </div>
                <div class="text">
                    <h1 class="title">{{headerTitle}}</h1>
                </div>
           </div>
           <scroll class="list" ref="list" :data="listDetail" :listen-scroll="listenScroll" :probe-type="probeType" @scroll="scroll">
              <div class="music-list-wrapper">
                <!-- 显示背景图片 -->
                <div class="bg-image" ref="bgImage" :style="bgStyle">
                    <div class="filter"></div>
                    <div class="text">
                        <h2 class="list-title">{{title}}</h2>
                        <p class="play-count" v-if="playCount">
                          <i class="fa fa-headphones"></i>
                          {{playCount}}
                        </p>
                    </div>
                </div>
                <!-- 显示歌曲 -->
                <div class="song-list-wrapper">
                    <!-- 点击后开始播放,需要添加一个点击函数 -->
                    <div class="sequence-play" v-show="listDetail.length" @click="sequence">
                        <i class="iconfont icon-bofangicon"></i>
                        <span class="text">播放全部</span>
                        <span class="count">(共{{listDetail.length}}首)</span>
                    </div>
                    <!-- listDetail数据传到组件中,songs是子组件的参数 -->
                    <song-list @select="selectItem" :songs="listDetail"></song-list>
                </div>
              </div>
           </scroll>
           <!-- 当数组中没有数据时，显示laoding的内容 -->
           <div class="loading-content" v-show="!listDetail.length">
              <loading></loading>
           </div>
       </div>
   </transition>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Scroll from '../../base/scroll/scroll'
import { getRecommendListDetail } from '../../api/recommend'
import { ERR_OK } from '../../common/js/config'
import { createRecommendListSong } from '../../common/js/song'
import SongList from '../../base/song-list/song-list'
import Loading from '../../base/loading/loading.vue'

const RESERVED_HEIGHT = 44

export default {
  data () {
    return {
      listDetail: [],
      headerTitle: '歌单',
      scrollY: 0
    }
  },
  created() {
    this._getRecommendListDetail(this.musicList.id)
    this.listenScroll = true
    this.probeType = 3
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.musicList.picUrl})`
    },
    title() {
      return this.musicList.name
    },
    playCount() {
      if (!this.musicList.playCount) {
        return
      }
      if (this.musicList.playCount < 1e5) {
        return Math.floor(this.musicList.playCount)
      } else {
        return Math.floor(this.musicList.playCount / 10000) + '万'
      }
    },
    ...mapGetters([
      'musicList',
      'playlist'
    ])
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    // 返回
    back() {
      this.$router.go(-1)
    },
    // 播放,从子组件中传递两个值
    selectItem (item, index) {
      this.selectPlay({
        list: this.listDetail,
        index: index
      })
    },
    // 注意一下啊id怎么来的:点击一个图片获取其id
    _getRecommendListDetail(id) {
      if (!id) {
        this.$router.push('/recommend')
        return
      }
      getRecommendListDetail(id).then((res) => {
        if (res.status === ERR_OK) {
          this.listDetail = res.data.playlist.tracks.map((item) => {
            return createRecommendListSong(item)
          })
        } else {
          console.error('getRecommendListDetail 获取失败！')
        }
      })
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    sequence() {
      const list = this.listDetail
      this.sequencePlay({
        list: list
      })
    },
    ...mapActions([
      'selectPlay',
      'sequencePlay'
    ])
  },
  // 响应数据变化
  watch: {
    // 当向下滑动时,监听scrollY值变化
    scrollY(newY) {
      const percent = Math.abs(newY / this.imageHeight)
      if (newY < (this.minTranslateY + RESERVED_HEIGHT - 20)) {
        this.headerTitle = this.musicList.name
      } else {
        this.headerTitle = '歌单'
      }
      if (newY < 0) {
        this.$refs.header.style.background = `rgba(212, 68, 57, ${percent})`
      } else {
        this.$refs.header.style.background = 'rgb(212, 68, 57)'
      }
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}

</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s
}
.slide-enter, .slide-leave-to {
  transform: translate3d(30%, 0, 0);
  opacity: 0;
}
.music-list {
  position: fixed;
  z-index:1000;
  top:0;
  left:0;
  bottom:0;
  right: 0;
  background:#F2F3F4;
}
.music-list .header{
    position: fixed;
    top: 0;
    width: 100%;
    height: 44px;
    color: #fff;
    z-index: 100;
}
.music-list .header .back{
    position: absolute;
    top: 0;
    left: 4px;
}
.music-list .header .back .fa-angle-left{
    padding: 5px 10px;
    font-size: 30px;
}
.music-list .header .text{
    position: absolute;
    left:38px;
    line-height:44px;
    font-size:16px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.music-list .list{
    position: fixed;
    top:0;
    bottom:0;
    width: 100%;
    background:#F2F3F4;
}
.music-list .list .music-list-wrapper .bg-image{
    position: relative;
    width:100%;
    height:0;
    padding-top:75%;
    transform-origin: top;
    background-size:cover;
    background-position: 0 30%;
}
.music-list .list .music-list-wrapper .bg-image .filter{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0.2;
}
.music-list .list .music-list-wrapper .bg-image .text{
    position: absolute;
    width:80%;
    height:40px;
    bottom:50px;
    left:15px;
    color: #fff;
}
.music-list .list .music-list-wrapper .bg-image .text .play-count{
    position: absolute;
    bottom:-16px;
    font-size:11px;
}
.music-list .list .music-list-wrapper .bg-image .text .list-title{
    position: absolute;
    bottom: 0;
    font-size: 16px;
    line-height: 18px;
    font-weight: bold;
    letter-spacing: 1px;
}
.music-list .music-list-wrapper .song-list-wrapper {
    padding:41px 0 20px 0;
    border-radius: 10px;
    position: relative;
    top:-20px;
    background:#F2F3F4;
}
.music-list .list .music-list-wrapper .song-list-wrapper .sequence-play {
  position: absolute;
  top:0px;
  display: flex;
  align-items: center;
  width:100%;
  height:40px;
  padding-left:16px;
  border-bottom: 1px solid rgb(194, 194, 194);
}
.music-list .list .music-list-wrapper .song-list-wrapper .iconfont{
    font-size: 18px;
    color:#2E3030;
    padding-right: 14px;
}
.music-list .list .music-list-wrapper .song-list-wrapper .text{
    font-size:16px;
}
.music-list .list .music-list-wrapper .song-list-wrapper .count{
    font-size:16px;
    color:#757575;
}
.loading-content {
  position: fixed;
  width: 100%;
  top: 70%;
  transform: translateY(-50%);
}
</style>
