import * as types from '../store/mutation-types'

const mutations = {
  // mutations第一个参数一定是state,musicList是recommend.vue传来的item
  [types.SET_MUSIC_LIST] (state, musicList) {
    state.musicList = musicList
  },
  // 变更searchHistory
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchHistory = history
  },
  // 变更singer
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  // 喜欢列表
  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playlist = list
  },
  // 更改播放模式
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  }

}
export default mutations
