<template>
    <div class="song-list">
      <!-- 显示歌曲列表,索引值 歌曲名 歌手 -->
        <ul>
            <li class="item" v-for="(song,index) in songs" :key="song.id" @click="selectItem(song, index)">
                <p class="count">{{index+1}}</p>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
  // 子组件通过 props方法获取父组件传递过来的值
  props: {
    songs: {
      type: Array
    }
  },
  methods: {
    // 子组件通过$emit方法向父组件传递参数
    selectItem(item, index) {
      this.$emit('select', item, index)
    },
    getDesc(song) {
      if (song.aliaName) {
        return `${song.singer} - ${song.aliaName}`
      } else {
        return `${song.singer}`
      }
    }
  }
}
</script>
<style scoped>
.song-list .item{
  position:relative;
  display:flex;
  align-items: center;
  box-sizing: border-box;
  height:60px;
  border-bottom: 1px solid rgb(194, 194, 194);
}
.song-list .item .count{
    flex: 0 0 50px;
    width:50px;
    text-align: center;
    color: #757575;
}
.song-list .item .content{
    flex:1;
    line-height: 20px;
    overflow: hidden;
}
.song-list .item .content .name{
    margin-top:4px;
    width:80%;
    text-align:left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.song-list .item .content .desc{
   text-overflow: ellipsis;
   white-space: nowrap;
   overflow: hidden;
   text-align:left;
   width:80%;
   font-size:12px;
   color:#757575;
}
</style>
