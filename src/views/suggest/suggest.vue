<template>
    <div class="suggest">
      <!-- v-show="!searchShow&&query&&songs.length>0" -->
        <div class="search-suggest" v-show="!searchShow && query && songs.length > 0">
          <!-- v-show='showSinger&&showList' -->
            <p class='title' v-show='showSinger && showList'>最佳匹配</p>
            <!-- 显示歌手,点击后跳转到歌手页面 @click="selectItem(suggest.artists[0])"先不写-->
            <div class="search-suggest-item" @click="selectItem(suggest.artists[0])" v-if="suggest.artists && showSinger">
                <img :src="suggest.artists[0].img1v1Url" width="50" height="50">
                <span>歌手:{{suggest.artists[0].name}}</span>
            </div>
            <!-- 显示歌单 -->
            <div class="search-suggest-item">
                <div class="text">
                    <!-- <img :src="suggest.playlists.coverImgUrl" width="50" height="50"> -->
                    <p>歌单:</p>
                    <p class="singer"></p>
                </div>
            </div>
        </div>
        <!-- 显示他的歌曲 -->
        <ul class="suggest-list" ref="suggestList" v-show="!searchShow">
          <li class="suggest-item" v-for="(item,index) in songs" :key="index">
            <div class="icon">
              <i></i>
            </div>
            <div class="name">
              <p class="song">{{item.name}}</p>
              <p class="singer">{{item.singer}}</p>
            </div>
          </li>
          <loading v-show="haveMore && query"></loading>
        </ul>
        <div class="no-result-wrapper" v-show="!haveMore && !songs.length && query">抱歉，暂无搜索结果</div>
    </div>
</template>
<script>
import { getSearchSuggest, getSearchSongs } from '../../api/search'
import Loading from '../../base/loading/loading.vue'
import Singer from '../../common/js/singer'
import { createSearchSong } from '../../common/js/song'

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    showList: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      singer: {},
      suggest: {},
      page: 0,
      songs: [],
      haveMore: true,
      searchShow: true
    }
  },
  methods: {
    // 只有点击歌手后，才能将搜索结果存入到good-storage中
    selectItem (item) {
      const singer = new Singer({
        id: item.id,
        name: item.name,
        avatar: item.img1v1Url
      })
      // 有个bug：在歌手列表中点击什么,就只能跳转到什么歌手
      this.$router.push({
        path: `/search/singer/${singer.id}`
      })
      this.$emit('select')
    },
    // 需要watch里调用search
    search() {
      this.searchShow = false
      this.haveMore = true
      getSearchSongs(this.query, this.page).then((res) => {
        if (!res.data.result.songs) {
          this.haveMore = false
          return
        }
        const list = res.data.result.songs
        const ret = []
        // 将list里的每个元素包装成一个对象，传到ret数组中
        list.forEach((item) => {
          ret.push(createSearchSong(item))
        })
        this.songs = ret
        this.$emit('refresh')
      })
      this.page += 30
      getSearchSuggest(this.query).then((res) => {
        this.suggest = res.data.result
      })
    },
    // 翻页
    searchMore() {
      // console.log('searchMore')
      if (!this.songs.length) {
        return
      }
      if (!this.haveMore) {
        return
      }
      getSearchSongs(this.query, this.page).then((res) => {
        if (!res.data.result.songs) {
          this.haveMore = false
          return
        }
        const list = res.data.result.songs
        const ret = []
        // 将list里的每个元素包装成一个对象，传到ret数组中
        list.forEach((item) => {
          ret.push(createSearchSong(item))
        })
        this.songs = this.songs.concat(ret)
        this.$emit('refresh')
        this.page += 30
      })
    }
  },
  watch: {
    query(val) {
      if (val === '') {
        this.suggest = {}
        this.songs = []
        this.haveMore = false
        return
      }
      this.suggest = {}
      this.songs = []
      this.searchShow = true
      this.page = 0
      this.haveMore = true
      this.search()
    },
    songs(songs) {
    }
  },
  components: {
    Loading
  }
}
</script>
<style scoped>
.suggest {
    height:100%;
    overflow: hidden;
}
.suggest .search-suggest .title{
    padding-left: 20px;
    padding-bottom:10px;
    color:rgb(212, 68, 57);
    font-size:11px;
    text-align: left;
}
.suggest .search-suggest .search-suggest-item {
    display: flex;
    align-items: center;
    padding: 8px 20px;
    border-bottom: 1px solid rgb(228,228,228);
    font-size:14px;
}
.suggest .search-suggest .search-suggest-item img{
    flex:0 0 50px;
    padding-right: 15px;
}
.suggest .search-suggest .search-suggest-item .text{
    width:100%;
}
.suggest .search-suggest .search-suggest-item .text p{
    padding:3px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.suggest .suggest-list {
  padding-bottom: 30px;
}
.suggest .suggest-list .suggest-item {
  display: flex;
  padding: 3px 20px;
  height:50px;
  /* 在flex容器中的对齐方式 */
  align-items: center;
  border-bottom: 1px solid rgb(228,228,228);
}
.suggest .suggest-list .suggest-item p{
  padding:3px 0;
}
.suggest .suggest-list .suggest-item .song{
  font-size: 16px;
  color:#2E3030 ;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.suggest .suggest-list .suggest-item .singer{
  font-size:12px;
  color: #757575;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.suggest .no-result-wrapper{
  position: fixed;
  overflow: hidden;
  left:50%;
  top:40vh;
  transform: translatex(-50%);
  color:#2E3030;
}
</style>
