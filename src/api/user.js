import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/login-in',
    method: 'post',
    params: {
      account: data.username,
      password: data.password
    }
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/bc/web/getUser',
//     method: 'get'
//   })
// }

export function logout() {
  return request({
    url: '/login/login-out',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/permission/get-current-account-info',
    method: 'get'
  })
}
