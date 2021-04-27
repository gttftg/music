<template>
    <div class='tab'>
        <!-- tag渲染成某种标签 -->
        <router-link tag='div' class='tab-item' to='recommend'>
            <span>推荐</span>
        </router-link>
        <!-- <router-link tag='div' class='tab-item' to='rank'>
            <span>排行</span>
        </router-link> -->
        <router-link tag='div' class='tab-item' to='singer'>
            <span>歌手</span>
        </router-link>
    </div>
</template>
<script>
export default {
}
</script>
<style scoped>
.tab
{
    /*弹性布局*/
    display:flex;
    height:44px;
    line-height: 44px;
    width:100%;
    background:rgb(212, 68, 57);
    font-size:14px;
}
.tab .tab-item
{
    /* 如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话） */
    flex:1;
    text-align: center;
    color:rgb(228, 228, 228);
}
.tab .tab-item span
{
    padding-bottom: 3px;
}
.tab .router-link-active span
{
    font-weight:bold;
    color:rgb(241, 241, 241);
    border-bottom:2px solid rgb(241, 241, 241);
}
</style>
