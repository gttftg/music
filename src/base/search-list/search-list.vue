<template>
    <div class="search-list">
        <!-- 多个组件进行过渡 -->
        <transition-group>
            <!-- 这里的searches是怎传来的？,这里需要点击歌手信息才能将数据传入到good-storage中 -->
            <li class="search-item" v-for="item in searches" :key="item" @click="selectItem(item)">
                <span class="text">{{item}}</span>
                <!-- @click.stop此时子组件会阻止父组件的click方法执行，即阻止父节点冒泡 -->
                <span class="icon" @click.stop="deleteOne(item)">
                  <i class="icon-delete"></i>
                </span>
            </li>
        </transition-group>
    </div>
</template>
<script>
export default {
  props: {
    searches: {
      type: Array
    }
  },
  methods: {
    // 将搜索历史的内容传参到父组件中
    selectItem(item) {
      console.log(item)
      this.$emit('select', item)
    },
    deleteOne(item) {
      this.$emit('delete', item)
    }
  }
}
</script>
<style scoped>
.search-list .search-item{
    display:flex;
    align-items: center;
    height:35px;
    overflow: hidden;
    font-size:14px;
}
.search-list .search-item.list-enter-active,.search-item.list-leave-active{
    transition: all 0.1s;
}
.search-list .search-item .text{
    flex:1;
    color:#494d4d;
    text-align: left;;
}
.search-list .search-item .icon:before{
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
}
.search-list .search-item .icon .icon-delete{
    font-size:14px;
    color:#2E3030;
}
</style>
