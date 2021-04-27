export default class Song {
  constructor ({ id, singer, name, album, image }) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.image = image
  }
}
export function SingerName (arr) {
  let name = []
  name = arr.map((item) => {
    return item.name
  })
  return name.join('/')
}

// 获取歌曲：id,名，歌手名，专辑，专辑图
export function createRecommendSong (music) {
  return new Song({
    id: music.id,
    name: music.name,
    singer: SingerName(music.song.artists),
    album: music.song.album,
    image: music.song.album.picUrl
  })
}

// 获取歌曲：id,歌手名,音乐名,专辑名
export function createSearchSong (music) {
  return new Song({
    id: music.id,
    singer: SingerName(music.artists),
    name: music.name,
    album: music.album.name
  })
}

// music-list:返回Song对象
export function createRecommendListSong(music) {
  return new Song({
    id: music.id,
    singer: SingerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl
  })
}

export function createSong(music) {
  return new Song({
    id: music.id,
    singer: SingerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl
  })
}
