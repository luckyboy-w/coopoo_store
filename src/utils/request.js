import axios from 'axios'
import Qs from 'qs'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'


// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000 * 10 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }

    config.headers['Web-Site'] = 'Backend-Plat'
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

    if (config['method'] != 'get') {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
      // if(requestBodyUrl.indexOf(config.url) != -1){
      //   config.headers['Content-Type'] = 'application/json;charset=UTF-8'
      // }else{
      //   config.transformRequest = [function(data) {
      //     // 在请求之前对data传参进行格式转换
      //     data = Qs.stringify(data)
      //     return data
      //   }]
      // }

    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
 response => {
   const res = response.data
   // if the custom code is not 20000, it is judged as an error.
   if (res.errCode != '0') {

     if (res.errCode == 10004) {
       Message({
         message: '登录超时，请重新登录',
         type: 'error',
         duration: 5 * 1000
       });
       store.dispatch('user/resetToken').then(() => {
         location.reload()
       })
       // location.href = process.env.NODE_ENV === 'production' ? '/' : '/backend';
     }else{
       Message({
         message: res.message || 'Error',
         type: 'error',
         duration: 3 * 1000
       })
     }
     return Promise.reject(new Error(res.message || 'Error'))
   } else {
     return res
   }
 },
  error => {
    console.log('err' + error) // for debug
    /*Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })*/
    // Message({
    //   message: '请求超时，请刷新页面后再试',
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
