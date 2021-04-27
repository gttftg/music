<template>
   <div class="player" v-show="playlist.length>0">
       <transition name="normal">
          <div class="normal-player" >
            <!-- 获取歌曲的封面,上面覆盖一层遮罩-->
            <div class="background">
              <div class="filter"></div>
              <img :src="currentSong.image" width="100%" height="100%">
            </div>
            <!-- 该顶部显示一个下三角,中间是歌曲的名字和名称 -->
            <div class="top">
              <div class="back" @click="back">
                <i class="fa fa-angle-down"></i>
              </div>
              <!-- 得到歌曲的名字和歌手名 -->
              <h1 class="title" v-html="currentSong.name"></h1>
              <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>

            <!-- 中间部分显示cd封面为圆形,点击之后,显示歌词部分-->
            <div class="middle" @click="changeMiddle">
              <!-- 圆形封面部分 -->
              <transition name="middleL">
                  <!-- 若是cd模式则显示，否则就隐藏 -->
                  <div class="middle-l"  v-show="currentShow==='cd'">
                    <div class="cd-wrapper">
                      <div class="cd" :class="cdCls">
                        <img :src="currentSong.image" class="image">
                      </div>
                    </div>
                  </div>
              </transition>
              <!-- 歌词部分 -->
              <transition name="middleR">
                <scroll class="middle-r" ref="lyricList" v-show="currentShow==='lyric'" :data="currentLyric&&currentLyric.lines">
                  <div class="lyric-wrapper">
                    <div class="currentLyric" v-if="currentLyric">
                      <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}" v-for="(line, index) in currentLyric.lines" :key="line.key">
                        {{line.txt}}
                      </p>
                    </div>
                    <p class="no-lyric" v-if="currentLyric === null">{{upDatecurrentLyric}}</p>
                  </div>
                </scroll>
              </transition>
            </div>

            <!-- 底部:进度条(播放时间,总时间)+5个图标 -->
            <div class="bottom">
              <!-- 进度条+时间 -->
              <div class="progress-wrapper">
                <span class="time time-l">{{format(currentTime)}}</span>
                <div class="progress-bar-wrapper">
                  <!-- 定义一个进度条组件 -->
                  <progress-bar :percent="percent" @percentChangeEnd="percentChangeEnd" @percentChange="percentChange"></progress-bar>
                </div>
                <span class="time time-r">{{format(duration)}}</span>
              </div>
              <!-- 底下一系列小图标 -->
              <div class="operators">
                <div class="icon i-left">
                  <!-- 播放模式 -->
                  <i class="iconfont mode" :class="iconMode" @click="changeMode"></i>
                </div>
                <div class="icon i-left">
                  <!-- 上一首 -->
                  <i class="iconfont icon-prev" @click="prev"></i>
                </div>
                <div class="icon i-center">
                  <!-- 播放 -->
                  <i class="iconfont" @click="togglePlaying" :class="playIcon"></i>
                </div>
                <div class="icon i-right">
                  <!-- 下一首 -->
                  <i class="iconfont icon-test" @click="next"></i>
                </div>
                <div class="icon i-right">
                  <!-- 是否收藏 -->
                  <i class="iconfont" @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
                </div>
              </div>
            </div>
          </div>
       </transition>

        <!--一个遮罩层 -->
       <transition name="mini">
         <div class="mini-player" v-show="!fullScreen" @click.stop="open">
           <div clas="icon">
             <img :class="cdCls" :src="currentSong.image" width="40" height="40">
           </div>
           <div class="text">
             <h2 class="name" v-html="currentSong.name"></h2>
             <div class="desc" v-html="currentSong.singer"></div>
           </div>
           <div class="control" @click.stop="togglePlaying">
             <progress-circle :radius="radius" :percent="percent">
               <i class="fa" :class="miniIcon"></i>
             </progress-circle>
           </div>
           <div class="control" @click.stop="showPlaylist">
             <i class="iconfont icon-caidan1"></i>
           </div>
         </div>
       </transition>

       <playlist ref="playlist" @stopMusic="stopMusic"></playlist>
       <!-- 播放音频 -->
       <audio id="music-audio" ref="audio" @ended="end" autoplay @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
   </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import scroll from '../../base/scroll/scroll.vue'
import Lyric from 'lyric-parser'
import { getSong, getLyric } from '../../api/song'
import ProgressBar from '../../base/progress-bar/progress-bar.vue'
import ProgressCircle from '../../base/progress-circle/progress-circle.vue'
import { playMode } from '../../common/js/config'
import { shuffle } from '../../common/js/util'
import playlist from '../../components/playlist/playlist'

export default {
  data () {
    return {
      noLyric: false,
      currentLyric: null,
      currentLineNum: 0,
      currentTime: 0,
      duration: 0,
      songReady: false,
      radius: 32,
      // cd模式为封面,还有个歌词模式
      currentShow: 'cd',
      playingLyric: '',
      percent: 0
    }
  },
  created () {
    this.move = false
  },
  components: { scroll, ProgressBar, playlist, ProgressCircle },
  methods: {
    back() {
      this.setFullScreen(false)
      this.currentShow = 'cd'
    },
    // 中间部分图片点击后，显示歌词
    changeMiddle() {
      // 如果是cd模式，点击事件触发变成歌词模式,反之
      if (this.currentShow === 'cd') {
        this.currentShow = 'lyric'
      } else {
        this.currentShow = 'cd'
      }
    },
    _getSong(id) {
      getSong(id).then((res) => {
        this.url = res.data.data[0].url
      })
    },
    // 获取歌词
    _getLyric(id) {
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLyric = null
      }
      this.noLyric = false
      getLyric(id).then((res) => {
        console.log(res)
        this.currentLyric = new Lyric(res.data.lrc.lyric, this.handleLyric)
        // 是否播放
        if (this.playing) {
          this.currentLyric.play()
          // 歌词重载后,高亮行设置为0
          this.currentLineNum = 0
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
      }).catch(() => {
        this.currentLyric = null
        this.noLyric = true
        this.currentLineNum = 0
      })
    },
    // 处理歌词
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        const lineE1 = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineE1, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    // 改变播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    // 是否收藏
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    // 收藏之后图标发生改变
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-like'
      } else {
        return 'icon-dislike'
      }
    },
    _resetCurrentIndex(list) {
      const index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    percentChange(percent) {
      this.move = true
      const currentTime = this.duration * percent
      this.currentTime = currentTime
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    percentChangeEnd (percent) {
      this.move = false
      const currentTime = this.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.$refs.audio.play()
        this.setPlayingState(true)
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // 用format做格式化时间处理
    format (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      let second = interval % 60
      if (second < 0) {
        second = '0' + second
      }
      return minute + ':' + second
    },
    // 播放上一首
    prev() {
      // 设置songReady 标志位 如果歌曲没有准备就绪，点击下一首的时候直接return false
      if (!this.songReady) {
        return
      }
      this.songReady = false
      // 上一首曲下标
      let index = this.currentIndex - 1
      // 判断播放列表界限重置
      if (index === -1) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      // 判断是否播放
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    togglePlaying(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    // 判断喜欢
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    // 下一首
    next() {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        // 判断播放列表是否重置
        if (index === this.playlist.length) {
          index = 0
        }
        this.currentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    // 停止音乐
    stopMusic() {
      // 删除最后一首的时候暂停音乐
      this.$refs.audio.pause()
      console.log('删除最后一首的时候暂停音乐')
    },
    // 显示歌曲
    showPlaylist() {
      this.$refs.playlist.show()
    },
    updateTime(e) {
      if (this.move) {
        return
      }
      this.currentTime = e.target.currentTime
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    error () {
      this.songReady = true
    },
    ready () {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    // 循环
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek()
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayMode: 'SET_PLAY_MODE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlaylist: 'SET_PLAYLIST',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList',
      'savePlayHistory'
    ])
  },
  computed: {
    iconMode() {
      // 播放模式：顺序,循环和随机三种,显示不同的图案
      if (this.mode === playMode.sequence) {
        return 'icon-next'
      } else if (this.mode === playMode.loop) {
        return 'icon-loop'
      } else {
        return 'icon-random'
      }
    },
    // 开始播放的图标
    playIcon() {
      return this.playing ? 'icon-stop' : 'icon-bofangicon'
    },
    // 暂停播放:判断播放状态
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    miniIcon() {
      return this.playing ? 'fa-stop' : 'fa-play'
    },
    upDatecurrentLyric() {
      if (this.noLyric) {
        return '暂无歌词'
      } else {
        return '歌词加载中'
      }
      // console.log('1')
      // console.log(this.noLyric)
      // return '歌词加载中'
    },
    ...mapGetters([
      'currentSong',
      'fullScreen',
      'playlist',
      'playing',
      'mode',
      'sequenceList',
      'favoriteList',
      'currentIndex'
    ])
  },
  watch: {
    // 当前播放的歌曲
    currentSong (newVal, oldVal) {
      if (!newVal.id) {
        return
      }
      if (newVal.id === oldVal.id) {
        return
      }
      this.$refs.audio.pause()
      this.$refs.audio.currentTime = 0
      this._getSong(newVal.id)
    },
    url(newUrl) {
      console.log(this.currentSong.id)
      this._getLyric(this.currentSong.id)
      this.$refs.audio.src = newUrl
      const stop = setInterval(() => {
        this.duration = this.$refs.audio.duration
        if (this.duration) {
          clearInterval(stop)
        }
      }, 150)
      this.setPlayingState(true)
    },
    // 歌曲当前时间
    currentTime() {
      // 当音乐不断变化时候，它与总时间有个不断变化的百分比
      this.percent = this.currentTime / this.duration
    }
  }
}
</script>

<style scoped>
.player .normal-player{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: #F2F3F4;
}
.player .normal-player .background{
  position:absolute;
  left: -50%;
  top: -50%;
  width: 300%;
  height: 300%;
  z-index: -1;
  opacity: 0.6;
  filter: blur(30px)
}
.player .normal-player .background .filter{
  position: absolute;
  width:100%;
  height: 100%;
  background: black;
  opacity: 0.6;
}
.player .normal-player .top{
  position: relative;
  margin-bottom:25px;
}
.player .normal-player .top .back{
  position: absolute;
  top:0;
  left:6px;
  z-index:50;
}
.player .normal-player .top .back .fa-angle-down{
  display: block;
  padding: 5px 9px;
  font-size: 35px;
  color:rgb(241, 241, 241);
}
.player .normal-player .top .title{
  width:70%;
  margin:0 auto;
  padding-top:10px;
  line-height: 20px;
  text-align:center;
  font-size:18px;
  font-weight: bold;
  color:rgb(241, 241, 241);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.player .normal-player .top .subtitle{
  width:70%;
  margin:0 auto;
  line-height:20px;
  text-align:center;
  font-size:12px;
  color:rgb(241, 241, 241);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.player .normal-player .middle{
  display:flex;
  align-items: center;
  position: fixed;
  width:100%;
  top:80px;
  bottom:170px;
  white-space:nowrap;
}
.player .normal-player .middle .middle-l{
  display:inline-block;
  vertical-align: top;
  position: relative;
  width:100%;
  height:0;
  padding-top:80%;
}
.player .normal-player .middle .middle-l .cd-wrapper{
  position:absolute;
  left:10%;
  top:0;
  width:80%;
  height:100%
}
.player .normal-player .middle .middle-l .cd-wrapper .cd{
  width:100%;
  height:100%;
  box-sizing: border-box;
  border:15px solid rgba(255,255,255,0.1);
  border-radius: 50%;
}
.player .normal-player .middle .middle-l .cd-wrapper .cd.play{
  /* 动画: 旋转*/
  animation: rotate 20s linear infinite;
}
.player .normal-player .middle .middle-l .cd-wrapper .cd.pause{
  /* 规定动画是暂停还是运行 */
  animation-play-state: paused
}
.player .normal-player .middle .middle-l .cd-wrapper .cd .image{
  position:absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  border-radius:50%;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.player .normal-player .middle .middle-r {
  display:inline-block;
  position:absolute;
  top:0;
  vertical-align: top;
  width:100%;
  height:100%;
  overflow:hidden;
}
.player .normal-player .middle .middle-r .lyric-wrapper{
  width:80%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
}
.player .normal-player .middle .middle-r .lyric-wrapper .text{
  line-height: 40px;
  color:#c7c7c7;
  font-size:14px;
}
.player .normal-player .middle .middle-r .lyric-wrapper .text.current{
  color:#FFF;
}
.player .normal-player .middle .middle-r .lyric-wrapper .no-lyric{
  line-height:40px;
  margin-top:60%;
  color:#c7c7c7;
  font-size:14px;
}
.player .normal-player .bottom{
  position:absolute;
  bottom:50px;
  width:100%;
}
.player .normal-player .bottom .progress-wrapper{
  display:flex;
  align-items: center;
  width:80%;
  margin: 0 auto;
  padding:10px 0;
}
.player .normal-player .bottom .progress-wrapper .time{
  color:rgb(241, 241, 241);
  font-size:11px;
  flex:0 0 30px;
  line-height:30px;
  width:30px;
}
.player .normal-player .bottom .progress-wrapper .time.time-l{
  text-align: left;
}
.player .normal-player .bottom .progress-wrapper .time.time-r{
  text-align: right;
  color:rgb(219, 219, 219);
}
.player .normal-player .bottom .progress-bar-wrapper{
  flex:1;
}
.player .normal-player .bottom .operators{
  display:flex;
  align-items: center;
}
.player .normal-player .bottom .operators .icon{
  flex:1;
  color:rgb(241, 241, 241);
}
.player .normal-player .bottom .operators .icon.disable{
  color: rgb(212, 68, 57);
}
.player .normal-player .bottom .operators .icon i{
  font-size: 30px;
}
.player .normal-player .bottom .operators .icon .mode{
  font-size:25px;
}
.player .normal-player .bottom .operators .icon.i-left{
  text-align: right;
}
.player .normal-player .bottom .operators .icon.i-center{
  padding:0 20px;
  text-align: center;
}
.player .normal-player .bottom .operators .icon.i-center i{
  font-size:40px;
}
.player .normal-player .bottom .operators .icon.i-right{
  text-align: left;
}
.player .normal-player .bottom .operators .icon .icon-like{
  color:rgb(240, 116, 107);
}
</style>
