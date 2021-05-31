import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/bc/web/login',
    method: 'post',
    params: {
      loginName: data.username,
      password: data.password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/bc/web/getUser',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/bc/web/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/bc/lyBuUser/getUser',
    method: 'get'
  })
}
