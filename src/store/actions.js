// axios是异步操作,需要actions,需要通过commit来调用mutation中的函数,来间接变更state中的数据
import { playMode } from '../common/js/config'
import { shuffle } from '../common/js/util'
import { saveSearch, deleteSearch, clearSearch, saveFavorite, deleteFavorite, savePlay } from '../common/js/cache'
import * as types from '../store/mutation-types'

// {commit}写法是解构得到的
export const saveSearchHistory = function ({ commit }, query) {
  // 缓存localStorage
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
// 关于music-list播放,传递了list,index参数
export const selectPlay = function ({ commit, state }, { list, index }) {
  // 顺序列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 如果播放模式为随机
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function ({ commit, state }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  const sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  // 如果歌曲删除完毕，那么停止播放
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function ({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

// 收藏部分保存喜欢的
export const saveFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

// 删除不喜欢
export const deleteFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}

export const savePlayHistory = function ({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 推荐页面中的推荐歌曲
export const insertSong = function ({ commit, state }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 纪录当前歌曲
  const currentSong = playlist[currentIndex]
  // 查找当前列表中是否有带插入的歌曲,并返回索引
  const fpIndex = findIndex(playlist, song)
  // 插入歌曲,索引+1
  currentIndex++
  // 插入歌曲
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列列表中的序号
    if (currentIndex > fpIndex) {
      // 删掉
      playlist.splice(fpIndex, 1)
      // 因为删除后数组前移，所以 Index--
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }
  const currentSIndex = findIndex(sequenceList, currentSong) + 1
  const fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fpIndex, 1)
    } else {
      sequenceList.splice(fpIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// music-list中的播放全部:顺序播放,传递了list参数
export const sequencePlay = function ({ commit }, { list }) {
  // 播放模式：顺序播放
  commit(types.SET_PLAY_MODE, playMode.sequence)
  // 顺序播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 播放列表
  commit(types.SET_PLAYLIST, list)
  // 当前索引
  commit(types.SET_CURRENT_INDEX, 0)
  // 是否全屏
  commit(types.SET_FULL_SCREEN, true)
  // 播放状态
  commit(types.SET_PLAYING_STATE, true)
}
