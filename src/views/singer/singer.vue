<template>
    <div class='singer' ref='singer'>
      <!-- 注意：这边data需要加this -->
      <listview :data='this.singers' ref='list' @select="selectSinger"></listview>
      <!-- 该行可以实现组件的跳转 -->
      <router-view></router-view>
    </div>
</template>
<script>
import Singer from '../../common/js/singer'
import { getSingers } from '../../api/singer'
import listview from '../../base/listview/listview'
import { mapMutations } from 'vuex'

// pinyin插件,将汉语转成拼音
const pinyin = require('pinyin')
const HOT_SINGERS = 10
const HOT_NAME = '热门'

export default {
  components: { listview },
  data () {
    return {
      singers: []
    }
  },
  // 生命周期
  created() {
    this._getSingers()
  },
  methods: {
    // 父组件得到传过来的值
    selectSinger(singer) {
      this.$router.push({ path: `/singer/${singer.id}` })
      this.setSinger(singer)
    },
    // 得到singers数组
    _getSingers() {
      getSingers().then((res) => {
        const s = res.data.artists
        s.map((item) => {
          // 汉字转拼音,获取每个名字的大写首字母
          const py = pinyin(item.name[0], {
            style: pinyin.STYLE_FIRST_LETTER
          })
          item.initial = py[0][0].toUpperCase()
        })
        // 将歌手名标准化
        this.singers = this._normalizeSinger(s)
      })
    },
    _normalizeSinger (list) {
      const map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGERS) {
          // 热门歌手里有10个数据
          map.hot.items.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias.join('/')
          }))
        }
        // key的值是A-Z
        const key = item.initial
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // 最终map对象中的内容是{A-Z,hot}
        map[key].items.push(new Singer({
          id: item.id,
          name: item.name,
          avatar: item.img1v1Url,
          aliaName: item.alias[0]
        }))
      })
      // 定义两个数组,作用在于将热门放于A-Z之前
      const hot = []
      const ret = []
      // 将map中的内容分为两个数组，hot中存放热门，ret中存放A-Z的内容
      for (const key in map) {
        const val = map[key]
        if (val.title.match(/[A-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // ret数组中对数值大小排列顺序,使其由A-Z排序
      ret.sort((a, b) => {
        // charCodeAt返回unicode编码,
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>
<style scoped>
.singer{
    position: fixed;
    width:100%;
    top:88px;
    bottom: 0;
}
</style>
