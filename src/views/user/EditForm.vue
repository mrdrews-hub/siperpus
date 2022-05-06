<template>
<div class="container">
  <v-form>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="form.username"
            label="username"
            :error-messages="v$.username.$error ? v$.username.$errors[0].$message : null"
            required
          >
          <v-slot ></v-slot>
          </v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="form.email"
            label="email"
            :error-messages="v$.email.$error ? v$.email.$errors[0].$message : null"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="form.password"
            :error-messages="v$.password.$error ? v$.password.$errors[0].$message : null"
            label="password"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="form.password2"
            :error-messages="v$.password2.$error ? v$.password2.$errors[0].$message : null"
            label="Confirm"
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-btn large color="primary" @click="save">
        Submit
    </v-btn>
  </v-form>

</div>
</template>
<script>
import { defineComponent, ref, reactive, computed } from '@vue/composition-api'
import useValidate from '@vuelidate/core'
import { required, minLength, email, sameAs, helpers, requiredUnless, requiredIf } from '@vuelidate/validators'
import Swal from 'sweetalert2'

export default {
    setup(props, context) {
        const valid = ref(false)
        const error = ref([])
        const form = reactive({
            username: '',
            email: '',
            password: '',
            password2: ''
        })

        const custom = reactive({
          required: helpers.withMessage('Tidak Boleh Kosong!', required),
        })

        const validator = computed(() => {
          return {
            username: { 
              required: custom.required,
            },
            email: { required, email },
            password: { 
              minLength: minLength(4),
              requiredIfRef: requiredIf(form.password2)
             },
            password2: { sameAs: helpers.withMessage('Password tidak sama', sameAs(form.password))}
          }
        })

        const v$ = useValidate(validator, form )
        v$.value.$validate()

        const save = () => {
          console.log(v$);
          if (v$.value.$error) {
            Swal.fire({
              icon: 'warning',
              title: 'validasi error',
              text: 'Silahkan Perbaiki dulu form yang berwarna merah 😉'
            })
            return
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Good Job!',
              text: 'Data Berhasil Dibuat'
            })
          }
        }

        return {
            valid,
            validator,
            form,
            v$,
            save
        }
    }
}
</script>
