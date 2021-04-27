<template>
<transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper">
        <div class="list-header">
            <h1 class="title">
              <i class="iconfont" @click="changeMode" :class="iconMode"></i>
              <span class="text">{{modeText}}
                  (<span class="count">{{playlist.length}}</span>)
              </span>
              <span class="clear" @click="showConfirm">
                  <i class="icon-clear"></i>
              </span>
            </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList">
          <transition-group name="list" tag="ul">
            <li class="item" ref="listItem" @click="selectItem(item, index)" v-for="(item, index) in sequenceList" :key="item.id">
              <i class="current fa" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表"
      confirmBtnText="清空"></confirm>
    </div>
</transition>
</template>
<script>
import scroll from '../../base/scroll/scroll.vue'
import confirm from '../../base/confirm/confirm'
import { playMode } from '../../common/js/config'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { shuffle } from '../../common/js/util'

export default {
  data() {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode ===
      playMode.random ? '随机播放' : '单曲循环'
    },
    iconMode() {
      if (this.mode === playMode.sequence) {
        return 'icon-next'
      } else if (this.mode === playMode.loop) {
        return 'icon-loop'
      } else {
        return 'icon-random'
      }
    },
    ...mapGetters([
      'sequenceList',
      'mode',
      'playing',
      'fullScreen',
      'playlist',
      'currentSong',
      'currentIndex'
    ])
  },
  methods: {
    // 隐藏
    hide () {
      this.showFlag = false
    },
    // 改变播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlay(this.mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      const index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 显示确认
    showConfirm() {
      this.$refs.confirm.show()
    },
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    // 确认清除
    confirmClear() {
      this.deleteSongList()
      this.hide()
      this.$emit('stopMusic')
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
    },
    // 得到当前的图标
    getCurrentIcon (item) {
      if (this.currentSong.id === item.id) {
        return 'fa-volume-up'
      }
      return ''
    },
    // 删除
    deletOne (item) {
      this.deleteSong(item)
      if (!this.playlist.length) {
        this.hide()
        this.$emit('stopMusic')
      }
    },
    ...mapMutations({
      setPlayList: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  components: {
    scroll,
    confirm
  }
}
</script>
<style scoped>
.playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: rgba(0,0,0,0.3);
}
.playlist.list-fade-enter-active, .playlist.playlist.list-fade-leave-active {
    transition: opacity 0.3s;
}
.playlist.list-fade-enter-active, .playlist.playlist.list-fade-leave-active .list-wrapper{
    transition: all 0.3s;
}
.playlist.list-fade-enter, .playlist.list-fade-leave-to {
    opacity: 0;
}
.playlist.list-fade-enter, .playlist.list-fade-leave-to .list-wrapper{
    transform: translate3d(0, 100%, 0);
}
.playlist .list-wrapper{
    position:absolute;
    left:0;
    bottom:0;
    width:100%;
    border-radius: 8px;
    background-color:#F2F3F4;
}
.playlist .list-wrapper .list-header{
    position: relative;
    padding: 20px 30px 10px 20px;
}
.playlist .list-wrapper .list-header .title{
    display:flex;
    align-items: center;
}
.playlist .list-wrapper .list-header .title .iconfont{
    margin-right: 10px;
    font-size: 20px;
    color: #757575;
}
.playlist .list-wrapper .list-header .title .text{
  flex:1;
  font-size: 14px;
  color: #2E3030;
}
.playlist .list-wrapper .list-header .title .text .count{
  position: relative;
  top: 1px;
}
.playlist .list-wrapper .list-header .title .clear{
  position: relative;
}
.playlist .list-wrapper .list-header .title .clear:before{
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
}
.playlist .list-wrapper .list-header .title .clear .icon-clear{
  font-size:14px;
  color: #757575;
}
.playlist .list-wrapper .list-content{
  max-height: 240px;
  overflow: hidden;
}
.playlist .list-wrapper .list-content .item{
  display: flex;
  align-items: center;
  height:40px;
  padding:0 30px 0 20px;
  overflow: hidden;
}
.playlist .list-wrapper .list-content .item.list-enter-active{
  transition: all 0.1s;
}
.playlist .list-wrapper .list-content .item.list-leave-active{
  transition: all 0.1s;
}
.playlist .list-wrapper .list-content .item.list-enter {
  height: 0;
}
.playlist .list-wrapper .list-content .item.list-leave-to {
  height:0;
}
.playlist .list-wrapper .list-content .item .fa-volume-up {
  margin-right:5px;
  color:rgb(212, 68, 57);
}
.playlist .list-wrapper .list-content .item .text{
  flex:1;
  line-height: 20px;
  font-size:14px;
  color:#2E3030;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.playlist .list-wrapper .list-content .item .delete{
  font-size:11px;
  color:rgb(212, 68, 57);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}
.playlist .list-wrapper .list-content .item .delete:before{
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
}
.playlist .list-wrapper .list-close{
  text-align: center;
  line-height: 50px;
  background:#F2F3F4;
  font-size:16px;
  color:#2E3030;
}
</style>
