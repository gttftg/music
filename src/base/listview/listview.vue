<template>
  <!-- @是v-on的缩写 -->
  <scroll class="listview"
  ref="listview"
  :listenScroll="listenScroll"
  @scroll="scroll"
  :probeType="probeType"
  >
    <!-- 显示歌手图片和名字 -->
    <ul>
      <!-- v-for一定要与v-bind:key="id"连用 -->
      <li v-for="group in data" class="list-group" :key="group.id" ref="listGroup">
        <!-- 一行显示A-Z和热门 -->
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.id">
            <!-- 图片+歌手名 -->
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 这是侧边区域：热,A-Z -->
    <!-- touchstart事件：当在屏幕上按下手指触发,onShortcutStart：实现点击索引跳转的功能 -->
    <!-- onShortcutMove：实现滑动跳转的功能 -->
    <div class="list-shortcut" @touchstart="onShortcutStart"
    @touchmove.stop.prevent="onShortcutMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
        class="item"
        :data-index="index"
        :key="item.id"
        :class="{'current': currentIndex === index}"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from '../scroll/scroll'
import { getData } from '../../common/js/dom'

const ANCHOR_HEIGHT = 20
// const TITLE_HEIGHT = 30

export default {
  // 获取父组件传来的值
  props: {
    data: {
      type: Array
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0
      // diff: -1
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  methods: {
    // 子向父传值item
    selectItem (item) {
      this.$emit('select', item)
    },
    refresh () {
      this.$refs.listview.refresh()
    },
    scroll (pos) {
      // 实时获取BScroll滚动的Y轴距离
      this.scrollY = pos.y
    },
    // 点击字母索引,实现索引跳转的功能
    onShortcutStart (e) {
      // 获取点击具体锚点的index值:(1,2,3...)
      const anchorIndex = getData(e.target, 'index')
      // 第一次触碰的位置
      const firstTouch = e.touches[0]
      // 保存第一次触碰的位置的Y值,pageY:触摸目标在页面中的y坐标
      this.touch.y1 = firstTouch.pageY
      // 保存第一次触碰时的锚点index值
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    // 滑动跳转的功能
    onShortcutMove (e) {
      const firstTouch = e.touches[0]
      // 记录一下移动时候的Y坐标,然后计算出移动了几个索引
      this.touch.y2 = firstTouch.pageY
      // 两次触碰Y轴的偏移锚点值
      const delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // 计算最后的位置,获取偏移了多少index值,this.touch.anchorIndex是字符串,转化为整形
      const anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      // 处理边界情况
      // 因为index通过滑动距离计算出来的
      // 所以向上滑超过索引框就会<0,向上会超过最大值
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // listHeight是正值,所以加个-
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 计算每个区块的高度列表,计算内容的高度
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  // 再用 watch 检测数据的变化,一旦变化，重新计算每个区块的高度列表。
  // 再判断当前滚动的Y轴值是否落在相应的 group 高度区间，
  // 然后更新 currentIndex,使 shortcut 的锚点高亮
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      // console.log(newY)
      // 向下滑动时,newVal是个负数,所以当newVal>0时,currentIndex直接为0
      const listHeight = this.listHeight
      // 当滚动至顶部以上
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 当在中间部分滚动,length-1是因为当初高度列表定义必须多一个,计算currentIndex的值
      for (let i = 0; i < listHeight.length - 1; i++) {
        const height1 = listHeight[i]
        const height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          return
        }
      }
      // 当超 -newVal > 最后一个高度的时候
      // 因为 this.listHeight 有头尾，所以需要 - 2
      this.currentIndex = listHeight.length - 2
    }
  },
  computed: {
    // 通过计算属性得到,取title的第一个字符
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped>
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #F2F3F4;
}
.listview .list-group .list-group-title {
  height: 20px;
  line-height: 20px;
  padding-left: 12px;
  margin-bottom: 10px;
  font-size: 11px;
  color: #fff;
  background:rgba(0, 0, 0, 0.1);
}
.listview .list-group .list-group-item {
  display: flex;
  align-items: center;
  padding: 5px 0;
  margin: 0 5px;
  border-bottom: 1px solid rgb(228, 228, 228);
}
.listview .list-group .list-group-item:last-child {
  border: none;
  margin-bottom: 10px;
}
.listview .list-group .list-group-item .avatar {
   width: 50px;
   height: 50px;
   border-radius: 3px;
}
.listview .list-group .list-group-item .name {
   margin-left: 20px;
   color: #2E3030;
   font-size: 14px;
}
.listview .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 200px 0;
    border-radius: 3px;
    text-align: center;
    font-family:Helvetica;
}
.listview .list-shortcut .item {
    padding: 5px 5px;
    line-height: 1;
    color: #757575;
    font-size: 11px;
    font-weight: bold;
}
.listview .list-shortcut .item.current {
    color: rgb(212, 68, 57);
}
.listview .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
.listview .list-fixed .fixed-title {
    height: 20px;
    line-height: 20px;
    padding-left: 20px;
    font-size: 11px;
    color: rgb(241, 241, 241);
    background: rgba(0, 0, 0, 0.1);
}
.listview .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
}
</style>
