<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-dialog
        v-model="editDialog"
        persistent
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Edit Rack</span>
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
import { defineComponent, ref, reactive, computed, toRefs, onMounted } from '@vue/composition-api'
import useValidate from '@vuelidate/core'
import { required, helpers, maxLength } from '@vuelidate/validators'
import Swal from 'sweetalert2'
import axios from 'axios'

export default defineComponent({
  props: {
    editDialog: Boolean,
    data: {
      type: Object,
      default(rawProps) {
        return { message: 'hello' }
      },
    },
  },

  setup(props, ctx) {
    const { data } = toRefs(props)
    const loading = ref(false)
    const form = reactive({
      id: data.value.id,
      rack: data.value.rack,
      info: data.value.info,
    })

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

    const save = () => {
      if (v$.value.$error) {
        Swal.fire({
          icon: 'warning',
          title: 'validasi error',
          text: 'Silahkan Perbaiki dulu form yang berwarna merah 😉',
        })
        loading.value = false
      } else {
        ctx.emit('save', form)
      }
    }

    const close = () => {
      ctx.emit('close')
    }

    return {
      form,
      save,
      close,
      v$,
    }
  },
})
</script>
