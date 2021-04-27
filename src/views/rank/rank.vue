<template>
    <div class='rank' ref="rank">
        <scroll class='toplist' ref="scroll">
            <ul>
                <li>
                </li>
            </ul>
        </scroll>
    </div>
</template>
<script>
import scroll from '../../base/scroll/scroll.vue'
// import { getTop } from '../../api/rank'

export default {
  data () {
    return {
      yunTopList: []
    }
  },
  created () {
    this._getTopList()
  },
  methods: {
  },
  components: { scroll }
}
</script>
<style scoped>

</style>
