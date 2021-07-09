import { asyncRoutes, constantRoutes, router } from '@/router'
import { getRoutes } from '@/api/role'

import store from '@/store'
import Layout from '@/layout'

const _import = require('@/_import_' + process.env.NODE_ENV)

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, userInfo) {
    return new Promise(resolve => {
      getRoutes().then((reponse) => {
        let accessedRoutes = reponse.data
        if (userInfo.access.includes('admin')) {
          const componentMap = {}
          // accessedRoutes = asyncRoutes || []
          accessedRoutes = buildComponent(accessedRoutes)
          // accessedRoutes = []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, userInfo.access)
        }

        const asRouter = asyncRoutes

        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function buildComponent(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (!route.component || route.component === '') {
      return false
    }

    if (route.component === 'Layout') {
      route.component = Layout
    } else {
      try {
        route.component = _import(route.component) // 导入组件
      } catch (e) {
        // 如果后端返回了不存在的组件 不能崩溃
        // 适用于堡垒环境后台数据发布 但正式环境前端未发布的场景
        route.component = null
        return false
      }
    }

    if (route.children && route.children.length) {
      route.children = buildComponent(route.children)
    }
    return true
  })

  return accessedRouters
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
