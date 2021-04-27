<template>
    <div class='recommend' ref="recommend">
        <!-- 获取数据为playList-->
        <scroll class='recommend-content' ref="scroll" :data='playList'>
            <div>
                <!-- banner 的背景 -->
                <div class='decorate' v-show="banner.length" v-if="banner.length"></div>
                <!-- banner部分 -->
                <div v-if="banner.length" class="slider-wrapper">
                    <slider>
                      <div v-for="item in banner" :key="item.id">
                        <img :src="item.imageUrl">
                      </div>
                    </slider>
                </div>
                <!-- 推荐歌单部分 -->
                <div class='recommend-list' ref='recommendList'>
                    <h1 class='title'>推荐歌单</h1>
                    <ul>
                        <!-- 这相当于一个li的布局 -->
                        <li class="item" v-for="item in playList" :key="item.id">
                            <!-- 获取图片,点击操作 -->
                            <div class="icon" @click="selectList(item)">
                                <!-- 在图片上方1/3处覆盖了一层阴影 -->
                                <div class="gradients"></div>
                                <!-- 实现图片懒加载 -->
                                <img v-lazy="item.picUrl">
                            </div>
                            <!-- 显示播放数量 -->
                            <p class='play-count'>
                                <!-- fontawesome图标库 -->
                              <i class="fa fa-headphones"></i>
                              {{Math.floor(item.playCount/10000)}}万
                            </p>
                            <!-- 显示歌曲名称 -->
                            <div class="text">
                                <p>{{item.name}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 推荐歌曲部分 -->
                <div class='recommend-song' ref='recommendSong'>
                    <h1 class='title'>推荐歌曲</h1>
                    <ul>
                        <li class="item" v-for="item in recommendMusic" :key="item.id" @click="selectSong(item)">
                            <!-- 具有点击操作 -->
                            <div class="icon">
                              <img v-lazy="item.image">
                              <p class='text'>{{item.name}}</p>
                              <p class='singer'>{{item.singer}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </scroll>
        <!-- 子路由父路由的页面覆盖 -->
        <router-view></router-view>
    </div>
</template>

<script>
import Slider from '../../base/slider/slider'
import Scroll from '../../base/scroll/scroll'
import { getBanner, getRecommendList, getRecommendMusic } from '../../api/recommend'
import { ERR_OK } from '../../common/js/config'
import { createRecommendSong } from '../../common/js/song'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      banner: [],
      playList: [],
      recommendMusic: []
    }
  },
  created () {
    this._getBanner()
    this._getRecommendList()
    this._getRecommendMusic()
  },
  methods: {
    // 得到banner数组
    _getBanner () {
      getBanner().then((res) => {
        if (res.status === ERR_OK) {
          const list = res.data.banners
          this.banner = list.splice(4)
          // 6个banner
          // console.log(this.banner)
        } else {
          console.error('Banner 获取失败')
        }
      })
    },
    // 推荐歌单
    _getRecommendList () {
      getRecommendList().then((res) => {
        if (res.status === ERR_OK) {
          this.playList = res.data.result
        } else {
          console.error('getRecommendList 获取失败')
        }
      })
    },
    // 推荐歌曲
    _getRecommendMusic () {
      getRecommendMusic().then((res) => {
        if (res.status === ERR_OK) {
          const list = res.data.result.map((item) => {
            return createRecommendSong(item)
          })
          // 返回一个Song对象,list.splice()表示删除的元素
          this.recommendMusic = list.splice(1)
        } else {
          console.error('getRecommendMusic 获取失败')
        }
      })
    },
    // 推荐歌单的点击函数
    selectList(item) {
      // 跳转到一个新的页面
      this.$router.push({ path: `/recommend/${item.id}` })
      this.setMusicList(item)
    },
    // 推荐歌曲的点击函数
    selectSong(item) {
      this.insertSong(item)
    },
    ...mapActions([
      'insertSong'
    ]),
    // 一个用{}，一个用[]
    ...mapMutations({
      setMusicList: 'SET_MUSIC_LIST',
      setFullScreen: 'SET_FULL_SCREEN'
    }),
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      // ref 写在标签上时：this.$refs.名字  获取的是标签对应的dom元素
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  },
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  components: {
    Slider,
    Scroll
  }
}
</script>
<style scoped>
.recommend{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    z-index: 100;
}
.recommend .recommend-content{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.recommend .recommend-content .decorate{
    position: absolute;
    top: -30vh;
    z-index: -10;
    background: rgb(212, 68, 57);
    width: 100%;
    height: 50vh;
    vertical-align: inherit;
}
.recommend .recommend-content .slider-wrapper{
    width: 96%;
    margin: 0 auto;
    border-radius: 5px;
    overflow: hidden;
}
/* 推荐歌单 */
.recommend .recommend-content .recommend-list{
    position: relative;
    box-sizing: border-box;
    width:100%;
    text-align: center;
}
.recommend .recommend-content .recommend-list .title{
    height: 65px;
    line-height: 65px;
    padding-left: 1.5%;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    color: #2E3030;
    margin-top:20px;
}
.recommend .recommend-content .recommend-list .item{
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    width: 33%;
    padding: 0 1%;
}
.recommend .recommend-content .recommend-list .item .icon{
    position: relative;
    display: inline-block;
    width: 100%;
    margin-bottom: 5px;
}
.recommend .recommend-content .recommend-list .item .icon .gradients{
    position: absolute;
    top: 0;
    width: 100%;
    height: 35px;
    border-radius: 3px;
    background: linear-gradient(rgba(109, 109, 109, 0.4),rgba(255, 255, 255, 0));
}
.recommend .recommend-content .recommend-list .item .icon img{
    width: 100%;
    height: 100%;
    border-radius: 3px;
}
.recommend .recommend-content .recommend-list .item .play-count{
    position:absolute;
    top:5px;
    right:8px;
    font-size:10px;
    color:rgb(241, 241, 241);
}
.recommend .recommend-content .recommend-list .item .text{
    height:40px;
    text-align: left;
    line-height:16px;
    font-size:11px;
    float: left;
    overflow: hidden;
    margin-bottom: 10px;
}
/* 推荐歌曲 */
.recommend .recommend-content .recommend-song{
    position: relative;
    box-sizing: border-box;
    width:100%;
    text-align: center;
}
.recommend .recommend-content .recommend-song .title{
    height: 65px;
    line-height: 65px;
    padding-left: 1.5%;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    color: #2E3030;
}
.recommend .recommend-content .recommend-song .item{
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    width: 33%;
    padding: 0 1%;
}
.recommend .recommend-content .recommend-song .item .icon{
    position: relative;
    display: inline-block;
    width: 100%;
    margin-bottom: 5px;
}
.recommend .recommend-content .recommend-song .item .icon img{
    width: 100%;
    height: 100%;
    border-radius: 3px;
}
.recommend .recommend-content .recommend-song .item .icon img{
    width: 100%;
    height: 100%;
    border-radius: 3px;
}
.recommend .recommend-content .recommend-song .item .text{
    height:40px;
    text-align: left;
    line-height:16px;
    font-size:11px;
    float: left;
    overflow: hidden;
    margin-bottom: 10px;
}
.recommend .recommend-content .recommend-song .item .singer{
    font-size: 11px;
    color:#757575;
    height:40px;
    text-align: right;
    line-height:16px;
    overflow: hidden;
    margin-bottom: 10px;
    /* 文本不换行 */
    white-space:nowrap;
    /* 文本溢出时用省略号表示 */
    text-overflow: ellipsis;
}
.router-view{
  z-index: 1000;
}
</style>
