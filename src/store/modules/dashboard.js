import { getMethod } from '@/api/request'

const state = {
  activeName: 'salesNum',
  analysisData: [],
  bestSale: [],
  worseSale: [],
  bestFav: [],
  worseFav: []
}

// getters
const getters = {
  chartsTitle: (state) => {
    return state.activeName === 'startsNum' ? '收藏量TOP5' : '商品销量TOP5'
  },
  chartsData: (state) => {
    if (state.activeName === 'startsNum') {
      return state.bestFav
    }
    return state.bestSale
  }
}

const mutations = {
  ADD_DATA_HANDLER: (state, { key, payload }) => {
    state[key] = payload
  },
  CHANGE_ACTIVE_NAME: (state, { value }) => {
    value && value != 0 && (state.activeName = value)
  }
}

const actions = {
  async getAnalysisData({ state, commit }) {
    const { data } = await getMethod('/bc/analysis/findAnalysisList', {})

    data.forEach((rowObj) => {
      let newData = rowObj.analysisList.splice(0, 5)

      if (rowObj.dataType == 'bestSale'
        || rowObj.dataType == 'worseSale'
        || rowObj.dataType == 'bestFav'
        || rowObj.dataType == 'worseFav') {
        commit('ADD_DATA_HANDLER', { key: rowObj.dataType, payload: newData })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
