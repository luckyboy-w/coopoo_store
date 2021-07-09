import request from '@/utils/request'

export const getMethod = (url, params) => {
  return request({
    url: url,
    params,
    method: 'get'
  })
}

export const postMethod = (url, data) => {
  return request({
    url: url,
    data,
    method: 'post'
  })
}

export const putMethod = (url, data) => {
  return request({
    url: url,
    data,
    method: 'put'
  })
}

export const deleteMethod = (url, data) => {
  return request({
    url: url,
    data,
    method: 'delete'
  })
}

export const getUploadUrl = () => {
  return process.env.VUE_APP_BASE_API + '/oss/upload'
}

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
