import { mapGetters, mapActions } from 'vuex'
// 对搜索歌手的数据传参
export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    // searchHistory只是个参数
    ...mapGetters(['searchHistory'])
  },
  method: {
    ...mapActions([
      'saveSearchHistory'
    ])
  }
}
