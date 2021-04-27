import axios from 'axios'
import { HOST } from '../common/js/config'

export function getTop (id) {
  const url = HOST + `/playlist/detail?id=${id}`
  return axios.get(url)
}
