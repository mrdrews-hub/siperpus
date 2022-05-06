import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import axios from 'axios'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
// import Vuelidate from 'vuelidate'
import 'sweetalert2/dist/sweetalert2.min.css'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost:3030/api'
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
// Vue.use(Vuelidate)
