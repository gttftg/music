import { loadSearch, loadFavorite } from '../common/js/cache'
import { playMode } from '../common/js/config'

const state = {
  // 推荐页面上歌单列表
  musicList: {},
  playlist: [],
  // 获取歌手
  singer: {},
  // 搜索历史,从本地存储中获取
  searchHistory: loadSearch(),
  favoriteList: loadFavorite(),
  // 全屏
  fullScreen: false,
  // 播放模式（顺序0，循环1，随机2）
  mode: playMode.sequence,
  // 播放状态
  playing: false,
  // 当前索引
  currentIndex: -1,
  // 顺序播放列表
  sequenceList: []
}
export default state
