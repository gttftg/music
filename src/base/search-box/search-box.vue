<template>
    <div class="search-box">
        <!-- v-model:双向数据绑定，表单元素变化,则query变化 -->
        <input :placeholder='placeholder' v-model='query' type="text" class='box'>
        <i v-show="query" class="icon-delete" @click="clear"></i>
    </div>
</template>
<script>
import { debounce } from '../../common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  created () {
    // 实时监听input值的变化,停止输入n秒后去请求,而不是时时请求数据
    // 不懂的地方：newQuery怎么来的 $watch监听query的值,300s后属性的变化定义为newQuery
    this.$watch('query', debounce((newQuery) => {
      // 子组件向父组件传值
      this.$emit('query', newQuery)
    }, 300))
  },
  methods: {
    clear () {
      this.query = ''
    },
    // 只有点击热门搜索里的内容,该函数触动
    setQuery(query) {
      this.query = query
    }
  }
}
</script>
<style scoped>
.search-box {
    display: flex;
    /* 居中对齐弹性盒 */
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 25px;
    border-bottom: 1px solid rgb(235,235,235);
}
.search-box .box {
    flex:1;
    line-height: 25px;
    background: rgb(212, 68, 57);
    color: #fff;
    font-size:15px;
    /* input输入框点击时去掉外框 */
    border: none;
    outline: medium;
    border-bottom:1px solid rgba(255, 255, 255, 0.6);
}
.search-box .box::placeholder{
    color:rgba(255, 255, 255, 0.6);
}
.search-box .icon-delete {
    position: absolute;
    right:12px;
    font-size:14px;
    color:rgba(255,255,255,0.8);
    border:none;
}
</style>
