<template>
    <ul class="switches">
      <li class="switch-item" v-for="(item, index) in switches" :key="item.id"
      @click="switchItem(index)" :class="{'active':currentIndex === index}">
        <span>{{item.name}}</span>
      </li>
    </ul>
</template>
<script>
export default {
  props: {
    switches: {
      type: Array
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem (index) {
      this.$emit('switch', index)
    }
  }
}
</script>
<style scoped>
.switches{
    display:flex;
    align-items: center;
    width:240px;
    margin:0 auto;
}
.switches .switch-item{
   flex:1;
   padding:8px;
   margin:0 20px;
   text-align: center;
   font-size: 14px;
   color: rgb(241, 241, 241);
   border-bottom: 2px solid rgb(212, 68, 57);
}
.switches .switch-item.active{
    border-bottom: 2px solid rgb(241, 241, 241);
    color:#fff;
}
</style>
