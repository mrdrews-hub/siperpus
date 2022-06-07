import Vue from 'vue'
import Vuex from 'vuex'
import jwtDecode from 'jwt-decode'
import jwt from 'jsonwebtoken'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    user: {},
  },
  getters: {
    getToken(state) {
      return state.token
    },
    isAdmin(state) {
      return state.user.role == 'admin' ? true : false
    },
    isRoot(state) {
      return state.user.role == 'root' ? true : false
    },
    isMember(state) {
      return state.user.role == 'member' ? true : false
    },
    isVerified(state) {
      return state.token == null ? false : true
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, value) {
      state.token = value
    },
  },
  actions: {
    login({ commit }, dataLogin) {
      sessionStorage.setItem('token', dataLogin.token)
      sessionStorage.setItem('user', JSON.stringify(dataLogin.userLogin))
      // const decoded = jwt_decode(token)
      commit('SET_USER', dataLogin.userLogin)
      // return axios.post('/auth/login', User)
      //         .then(({ data }) => {
      //             dispatch('verifytoken', data.token)
      //         })
      //         .catch(err => { throw new Error(err.message)} )
      // try {
      //     const { data } = await axios.post('/auth/login', User)
      //     const token = localStorage.setItem('token', data.token)
      //     commit('SET_TOKEN', data.token)
      // } catch (error) {
      //     return error
      // }
    },
    verifytoken({commit}, token) {
      return jwt.verify(token, 'silent', (err, decoded) => {
        if(err) {
          localStorage.removeItem('token')
          commit('SET_TOKEN', null)
          commit('SET_USER', {})
          console.log(err);
        }else{
          localStorage.setItem('token', token)
          commit('SET_TOKEN', token)
          commit('SET_USER', decoded)
          console.log(decoded);
        }
      })
      // if (!token) {
      //     alert('Silahkan Login Terlebih Dahulu')
      //     return
      // } else {
      //     try {
      //         const decoded = jwt.verify(token, 'silent')
      //         next()
      //     } catch (err) {
      //         alert('token invalid or expired')
      //         localStorage.removeItem('token')
      //     }
      // }
    },
    logout({ commit }) {
      commit('SET_USER', {})
    },
  },
})
