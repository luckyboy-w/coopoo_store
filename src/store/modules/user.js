import {
  // buLogin,
  login,
  logout,
  getInfo,
  getUserInfo
} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { requirer } from 'runjs/lib/script'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  supplierName: '',
  supplierAvatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_SUPPLIER_NAME: (state, payload) => {
    state.supplierName = payload
  },
  SET_SUPPLIER_AVATAR: (state, payload) => {
    state.supplierAvatar = payload
  }
}

const actions = {

  // bu-user login
  // buLogin({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     buLogin({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      //   const { access, name, avatar, introduction } = response.data

        // roles must be a non-empty array
        /*        if (!access || access.length <= 0) {
                  reject('getInfo: access must be a non-null array!')
                }*/
        const access = ["super_admin","admin"]
        const name = "admin"
        const avatar = "https://bucket.coopoo.com/2021-07-02/20210702143733wTIhIAetaroVmRLvErQuPyUhgUsKrATR.png"
        const introduction = "testUser"
        const data={
           access : ["super_admin","admin"],
           name : "admin",
           avatar : "https://bucket.coopoo.com/2021-07-02/20210702143733wTIhIAetaroVmRLvErQuPyUhgUsKrATR.png",
           introduction : "testUser"
        }
        const menus = []

        commit('SET_ROLES', access)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_MENUS', menus)
        resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      // const { access, buUser } = await dispatch('getInfo')
      const  access  = "admin"
      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', { access, buUser })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // get user info
   getUserInfo({ commit, state }) {
    commit('SET_SUPPLIER_AVATAR','https://bucket.coopoo.com/2021-07-02/20210702143733wTIhIAetaroVmRLvErQuPyUhgUsKrATR.png')
    // const { data } = await getUserInfo()
    getUserInfo().then(response => {
      const { data } = response
    commit('SET_SUPPLIER_NAME',data.storeName)
    console.log(data)
    }).catch(error => {
      reject(error)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
