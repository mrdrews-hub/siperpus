import Vue from 'vue'
import Vuex from 'vuex'
import jwtDecode from 'jwt-decode'
import auth from './modules/auth.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appname: 'SIPERPUS'
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: { auth },
})
