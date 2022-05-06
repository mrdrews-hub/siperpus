<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card
        class="auth-card"
        elevation="9"
        :loading="loading"
      >
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-4">
          <v-img
            class="logo-sma"
            max-width="85"
            src="@/assets/images/logos/sman4.png">
          </v-img>
          <h2 class="text-2xl font-weight-semibold">
            SI-PERPUS
          </h2>
        </v-card-title>
        <!-- login form -->
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="email"
              outlined
              label="Email"
              placeholder="john@example.com"
              hide-details
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="password"
              outlined
              :type="isPasswordVisible ? 'text' : 'password'"
              label="Password"
              placeholder="············"
              :append-icon="isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline"
              hide-details
              @click:append="isPasswordVisible = !isPasswordVisible"
              @keyup.enter="handleLogin"
            ></v-text-field>

            <v-btn
              :disabled="loading"
              block
              color="primary"
              class="mt-6"
              @click="handleLogin"
            >
              Login
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>

    <!-- background triangle shape  -->

    <img
      class="auth-mask-bg"
      :src="require(`@/assets/images/misc/wave.svg`)"
    >

    <!-- tree -->
    <v-img
      class="auth-tree"
      width="240"
      height="215"
      src="@/assets/images/misc/tree.png"
    ></v-img>

    <!-- tree  -->
    <v-img
      class="auth-tree-3"
      width="120"
      height="289"
      src="@/assets/images/misc/tree-3.png"
    ></v-img>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'
import { mapActions } from 'vuex'
import axios from 'axios'
import Swal from 'sweetalert2'
import VueRouter from 'vue-router'

export default {
  setup(props, context) {
    const router = context.root.$router
    const store = context.root.$store

    const isPasswordVisible = ref(false)
    const loading = ref(false)
    const email = ref('')
    const password = ref('')

    async function handleLogin() {
      loading.value = true
      try {
        const response = await axios.post('/auth/login', {
          email: email.value,
          password: password.value,
        })
        const { token } = response.data
        store.dispatch('login', token)
        loading.value = false
        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'Login Sukses',
          position: 'top-right',
          timer: 600,
        })
        router.push({ name: 'dashboard' }).catch(err => console.log(err))
      } catch (err) {
        Swal.fire({
          icon: 'warning',
          title: 'Username atau Password salah',
        })
        console.log(err.message)
        loading.value = false
      }
    }

    return {
      loading,
      isPasswordVisible,
      email,
      password,
      handleLogin,

      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
    }
  },
}
</script>

<style lang="scss">
@import '~@/plugins/vuetify/default-preset/preset/pages/auth.scss';
</style>
