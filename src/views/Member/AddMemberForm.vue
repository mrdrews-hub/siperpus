<template>
  <v-row justify="center">

    <v-col cols="auto">
      <v-dialog
        v-model="tambahDialog"
        persistent
        transition="dialog-bottom-transition"
        max-width="800"
      >
        <v-card
          :disabled="loading"
          :loading="loading">
          <v-card-title>
            <span class="text-h5">Add Members</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <!-- Kangge daftar -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.nisn"
                    :label="form.kelas == 'Guru' ? 'NIDN' : 'NIS'"
                    :error-messages="v$.nisn.$error ? v$.nisn.$errors[0].$message : null"
                    filled
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.nama"
                    label="Nama"
                    :error-messages="v$.nama.$error ? v$.nama.$errors[0].$message : null"
                    filled
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-combobox
                    v-model="form.kelas"
                    filled
                    :items="['X ', 'XI ', 'XII ', 'Guru']"
                    hide-selected
                    outlined
                    label="Kelas"
                  ></v-combobox>
                </v-col>
                <v-col cols="4">
                  <v-combobox
                    v-if="form.kelas && form.kelas !== 'Guru'"
                    v-model="form.detailKelas"
                    filled
                    :items="listKelas"
                    hide-selected
                    outlined
                    label="Kelas"
                  ></v-combobox>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="form.tempat"
                    filled
                    label="Tempat Lahir"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-menu
                    ref="menu"
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="dateMenu"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.tanggal_lahir"
                        label="Tanggal Lahir"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.tanggal_lahir"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="dateMenu = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(dateMenu)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.alamat"
                    filled
                    label="Alamat"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.no_hp"
                    filled
                    type="number"
                    label="No_HP"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.password"
                    filled
                    type="Password"
                    label="Password"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="flex justify-end">
            <v-btn
              color="error"
              elevation="3"
              rounded
              @click="close"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              elevation="3"
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

<script>
import {
  defineComponent, reactive, computed, onMounted, ref,
} from '@vue/composition-api'
import useValidate from '@vuelidate/core'
import { required, maxLength, helpers } from '@vuelidate/validators'
import Swal from 'sweetalert2'
import axios from 'axios'

export default defineComponent({
  props: {
    tambahDialog: Boolean,
    loading: Boolean,
  },

  setup(props, ctx) {
    const dateMenu = ref(false)
    const form = reactive({
      nisn: '',
      nama: '',
      kelas: '',
      detailKelas: '',
      alamat: '',
      tempat: '',
      tanggal_lahir: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      no_hp: '',
      password: '',
    })
    const validator = computed(() => {
      return {
        nama: {
          required: helpers.withMessage('Tidak Boleh Kosong!', required),
        },
        nisn: {
          required: helpers.withMessage('Tidak Boleh Kosong!', required),
        },
      }
    })
    const v$ = useValidate(validator, form)
    const listKelas = [
      'IPA 1',
      'IPA 2',
      'IPA 3',
      'IPA 4',
      'IPA 5',
      'IPS 1',
      'IPS 2',
      'IPS 3',
      'IPS 4',
      'IPS 5',
    ]

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
        console.log(form);
        const payload = {
          nisn: form.nisn,
          nama: form.nama,
          kelas: form.kelas + form.detailKelas,
          alamat: form.alamat,
          tempat: form.tempat,
          tanggal_lahir: form.tanggal_lahir,
          no_hp: form.no_hp,
          password: form.password,
        }
        ctx.emit('save', payload)
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
      listKelas,
      dateMenu,
    }
  },
})
</script>
