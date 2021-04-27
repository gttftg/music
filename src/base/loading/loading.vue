<template>
    <div class="loading">
        <img src="./loading.gif" width="24px" height="24px">
    </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在载入'
    }
  }
}
</script>
<style scoped>
.loading {
    width:100%;
    height:40px;
    text-align: center;
}
.loading .img{
    margin-top:10px;
}
</style>
