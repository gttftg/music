<template>
<!-- 1.音乐进度条实现：
    思想：播放进度条样式,定义高但不定义宽度
    父组件computed:当音乐不断变化的时候，他与总时间有个不断变化的百分比
    子组件接收的时候：watch它的变化,不断去修改progress和小球的宽度 
    2. 实现拖动效果
    定义触摸事件-->
    <div class="progress-bar" ref="progressBar">
      <div class="bar-inner">
          <div class="progress" ref="progress"></div>
          <!-- 添加事件监听 -->
          <div class="progress-btn-wrapper" ref="progressBtn"
          @touchstart.prevent='progressTouchStart'
          @touchmove.prevent="progressTouchMove"
          @touchend.prevent="progressTouchEnd">
              <div class="progress-btn"></div>
          </div>
      </div>
    </div>
</template>
<script>
import { prefixStyle } from '../../common/js/dom'
// 进度条上小球的宽度
const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  data() {
    return {
      newPercent: 0
    }
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    // 创建一个对象，用来保存函数中的一些数据
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      // 拖动开始
      this.touch.initiated = true
      // 记录开始点击位置
      this.touch.startX = e.touches[0].pageX
      // 记录当前的进度宽度
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      // 首先判断是否先进入touchstart方法
      if (!this.touch.initiated) {
        return
      }
      this._triggerPercent()
      // 偏移量长度=移动的位置-点击开始的位置
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX)))
      // 设置进度条宽度
      this._offset(offsetWidth)
    },
    progressTouchEnd (e) {
      this.touch.initiated = false
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChangeEnd', percent)
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      // 传递给父组件
      this.$emit('percentChange', percent)
    },
    // 不断改变样式
    _offset(offsetWidth) {
      this.$refs.progess.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        // 进度条的宽度减去小球宽度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 获得offset宽度
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>
<style scoped>
.progress-bar{
  height: 30px;
}
.progress-bar .bar-inner{
  position:relative;
  top:13px;
  height:4px;
  background:rgba(0,0,0,0.3);
}
.progress-bar .bar-inner .progress{
  position:absolute;
  height: 100%;
  background: rgb(212, 68, 57);
}
.progress-bar .bar-inner .progress-btn-wrapper{
  position:absolute;
  left:-8px;
  top:-13px;
  width:30px;
  height:30px;
}
.progress-bar .bar-inner .progress-btn-wrapper .progress-btn{
  position: relative;
  top:7px;
  left:7px;
  box-sizing: border-box;
  width:16px;
  height: 16px;
  border: 5px solid  rgb(241, 241, 241);
  border-radius: 50%;
  background: rgb(212, 68, 57);
}
</style>
