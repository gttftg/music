// Getter用于对Store中的数据进行加工处理形成新的数据
export const searchHistory = state => state.searchHistory

// 获取State的musicList(推荐页面)
export const musicList = state => state.musicList

// 获取歌手详细信息的页面
export const singer = state => state.singer

// 喜欢的歌曲列表在user中
export const favoriteList = state => state.favoriteList

// 关于播放的变量
export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const playing = state => state.playing

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
