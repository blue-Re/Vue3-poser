import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0
  },
  mutations: {
    changeCount(state,payload) {
      // state.count++
      state.count = payload
    }
  },
  actions: {
    asyncChangeCount({commit}, payload) {
      setTimeout(()=>{
        commit('changeCount', payload)
      },1000)
    }
  },
  getters: {
    countGetter(state){
      return state.count * 10;
    },
  },
  modules: {
  }
})
