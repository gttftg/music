// 不止需要改变state的数据,还要同时把数据存储到localStorage中
import storage from 'good-storage'

// 每一个存储都要定义一个key
const SEARCH_KEY = '_search_'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '_play_'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '_favorite_'
const FAVORITE_MAX_LENGTH = 200

// 封装插入数组的方法
// (存储的数据,存储的值,比较函数:用来比较插入的值是否存在于当前数组,最大值)
function insertArray (arr, val, compare, maxLen) {
  // 判断当前数组中是否有这个元素，findIndex需要传入函数
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  // 如果有,但不是第一个
  if (index > 0) {
    // 删除
    arr.splice(index, 1)
  }
  // 在数组最前面插入这个值
  arr.unshift(val)
  // 如果len大于最大值，就删除最后一个数
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 保存搜索结果
// 接收一个query的参数,这个参数是当前要保存的query
export function saveSearch (query) {
  // 查看当前存储空间的情况，如果没有,就是一个空数组
  const searches = storage.get(SEARCH_KEY, [])
  // 插入逻辑：searches里每一条和query比较
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  // 在缓存中保存searches
  storage.set(SEARCH_KEY, searches)
  // 将searches返回出来，供vuex调用
  return searches
}

// 加载本地缓存的搜索历史
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > 1) {
    arr.splice(index, 1)
  }
}

export function deleteSearch (query) {
  // 查看当前存储空间的情况，如果没有,就是一个空数组
  const searches = storage.get(SEARCH_KEY, [])
  // 删除：最大15条，
  deleteFromArray(searches, (item) => {
    return item === query
  })
  // 在缓存中保存searches
  storage.set(SEARCH_KEY, searches)
  // 将searches返回出来，供vuex调用
  return searches
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

// 播放列表,保存播放
export function savePlay(song) {
  const songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

// 喜欢列表
export function saveFavorite(song) {
  const songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}

export function deleteFavorite(song) {
  const songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}
