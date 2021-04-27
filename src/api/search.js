import { HOST } from '../common/js/config'
import axios from 'axios'

export function getSearchHot () {
  const url = HOST + '/search/hot'
  return axios.get(url)
}

// 搜索歌手 type=100就是歌手
export function getSearchSinger (name) {
  const url = HOST + `/search?keywords=${name}&type=100`
  return axios.get(url)
}

// offset用于分页
export function getSearchSongs (name, page) {
  const url = HOST + `/search?keywords=${name}&offset=${page}`
  return axios.get(url)
}

// 搜索建议,传入搜索关键词可获得搜索建议
export function getSearchSuggest (name) {
  const url = HOST + `/search/suggest?keywords=${name}`
  return axios.get(url)
}

// 传入音乐 id,可获得歌曲详情
export function getSongDetail (id) {
  const url = HOST + `/song/detail?ids=${id}`
  return axios.get(url)
}
