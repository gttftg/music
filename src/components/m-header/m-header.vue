<template>
    <div class='m-header'>
        <h1 class='text'>VMUSICJIN</h1>
        <!-- 两个图案指向两个不同的界面 -->
        <router-link to="user" class="mine" tag="div">
            <i class="iconfont icon-list1"></i>
        </router-link>
        <router-link to="search" class="search" tag="div">
            <i class="iconfont icon-search"></i>
        </router-link>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.m-header
{
    position: relative;
    height:44px;
    width:100%;
    text-align: center;
    background:rgb(212, 68, 57);
}
.text
{
    line-height: 44px;
    font-weight:bold;
    color:rgb(241, 241, 241);
    /*字母间距*/
    letter-spacing: 3px;
}
.mine
{
    position:absolute;
    top:-1.5px;
    left:0;
}
.mine .iconfont
{
    display: block;
    padding:11px;
    font-size: 22px;
    color:rgb(241, 241, 241);
}
.search
{
    position:absolute;
    top:0px;
    right:2px;
}
.search .iconfont
{
    display: block;
    padding:12px;
    font-size: 18px;
    color:rgb(241, 241, 241);
}
</style>
