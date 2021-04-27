<template>
   <transition name="slide">
      <div class="music-list">
        <div class="header" ref="header">
          <div class="back" @click="back">
            <i class="fa fa-angle-left"></i>
          </div>
          <div class="text">
            <h1 class="title">{{headerTitle}}</h1>
          </div>
        </div>
        <scroll class="list" :data="songs" :listen-scroll="listenScroll" :probe-type="probeType" @scroll="scroll" ref="list">
          <div class="music-list-wrapper">
            <!-- 显示背景图片 -->
            <div class="bg-image" ref="bgImage" :style="bgStyle">
              <div class="filter"></div>
                <div class="text">
                  <h2 class="list-title">{{title}}</h2>
                </div>
            </div>
            <div class="song-list-wrapper">
              <div class="sequence-play">
                <i class="iconfont icon-bofangicon"></i>
                <span class="text">播放全部</span>
                <span class="count">(共{{listDetail.length}}首)</span>
              </div>
              <song-list :songs="listDetail"></song-list>
            </div>
          </div>
          <div class="loading-content">
            <loading></loading>
          </div>
        </scroll>
      </div>
   </transition>
</template>
<script>
import { getSingerDetail } from '../../api/singer'
import { mapGetters } from 'vuex'
import { ERR_OK } from '../../common/js/config'
import Scroll from '../../base/scroll/scroll.vue'
import { createSong } from '../../common/js/song'
import SongList from '../../base/song-list/song-list.vue'
import Loading from '../../base/loading/loading.vue'

const RESERVED_HEIGHT = 44

export default {
  props: {
    songs: {
      type: Array
    }
  },
  data() {
    return {
      listDetail: [],
      node: null,
      headerTitle: '歌手',
      scrollY: 0
    }
  },
  created() {
    this._getDetail()
    this.listenScroll = true
    this.probeType = 3
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.status === ERR_OK) {
          this.node = res.data.hotSongs
        }
      })
    },
    _normalizeSongs(list) {
      const ret = []
      list.forEach((item) => {
        ret.push(createSong(item))
      })
      return ret
    },
    // scroll滑动的根本原因
    scroll (pos) {
      this.scrollY = pos.y
    }
  },
  computed: {
    handerTitleTouchDown() {
      let name = ''
      if (this.singer.aliaName) {
        name = this.singer.name + `(${this.singer.aliaName})`
      } else {
        name = this.singer.name
      }
      return name
    },
    bgStyle() {
      return `background-image: url(${this.singer.avatar})`
    },
    title() {
      return this.handerTitleTouchDown
    },
    ...mapGetters(['singer'])
  },
  watch: {
    node(val) {
      this.listDetail = this._normalizeSongs(val)
    },
    // 下滑时顶部有横栏
    scrollY(newY) {
      const percent = Math.abs(newY / this.imageHeight)
      if (newY < (this.minTranslateY + RESERVED_HEIGHT - 20)) {
        this.headerTitle = this.headerTitleTouchDown
      } else {
        this.headerTitle = '歌手'
      }
      if (newY < 0) {
        this.$refs.header.style.background = `rgba(212,68,57,${percent})`
      } else {
        this.$refs.header.style.background = `rgba(212,68,57,${percent})`
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
  z-index:100;
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
.loading-content{
  width:100%;
  height: 100%;
}
</style>
