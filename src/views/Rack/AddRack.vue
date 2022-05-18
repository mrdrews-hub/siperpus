<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-dialog
        v-model="tambahDialog"
        persistent
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <v-card
            :disabled="loading"
            :loading="loading"
            >
          <v-card-title>
            <span class="text-h5">Tambah Rack</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="form.rack"
                    :error-messages="v$.rack.$error ? v$.rack.$errors[0].$message : null"
                    counter="6"
                    label="Nama Rack"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-textarea
                    v-model="form.info"
                    filled
                    name="input-7-4"
                    label="Info"
                    placeholder="(optional)"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              rounded
              @click="close"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              rounded
              @click="save"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
sc
<script>
import {
  defineComponent, reactive, computed, onMounted, ref,
} from '@vue/composition-api'
import useValidate from '@vuelidate/core'
import { required, maxLength, helpers } from '@vuelidate/validators'
import Swal from 'sweetalert2'

export default defineComponent({
  props: {
    tambahDialog: Boolean,
    loading: Boolean,
  },

  setup(props, ctx) {
    const form = reactive({
      rack: '',
      info: '',
    })
    const loading = ref(false)
    const validator = computed(() => {
      return {
        rack: {
          required: helpers.withMessage('Tidak Boleh Kosong!', required),
          maxLength: maxLength(6),
        },
      }
    })

    const v$ = useValidate(validator, form)

    onMounted(() => {
      v$.value.$validate()
    })

    const save = async () => {
      if (v$.value.$error) {
        await Swal.fire({
          icon: 'warning',
          title: 'validasi error',
          text: 'Silahkan Perbaiki dulu form yang berwarna merah 😉',
        })
      } else {
        ctx.emit('save', form)
      }
    }

    const close = () => {
      ctx.emit('close')
    }

    return {
    //   loading,
      form,
      save,
      close,
      v$,
    }
  },
})
</script>
