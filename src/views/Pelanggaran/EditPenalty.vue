<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-dialog
        v-model="dialog"
        persistent
        transition="dialog-bottom-transition"
        max-width="800"
      >
        <v-card>
          <v-toolbar
            dark
            color="accent"
          >
            <v-toolbar-title>Add Penalty</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                fab
                color="accent"
                small
                @click="close"
              >
                <v-icon x-large color="error">{{ icon.mdiCloseBox }}</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text class="mt-4 flex">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-dialog
                    max-width="600"
                    v-model="memberDialog">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :prepend-inner-icon="icon.mdiAccountSearch"
                        label="Pilih Member"
                        outlined
                        filled
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-card>
                      <v-card-title class="flex justify-end">
                        <v-btn
                          @click="memberDialog = false"
                          fab>
                          <v-icon
                            color="error"
                            x-large>
                            {{ icon.mdiCloseBox }}
                          </v-icon>
                        </v-btn>
                      </v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="searchMember"
                          label="Cari Member"
                          outlined
                          filled
                          rounded
                        ></v-text-field>
                        <v-data-table
                          v-model="selectedMember"
                          :headers="memberHeader"
                          :items="members"
                          :search="searchMember"
                          item-key="nama"
                          show-select
                          single-select
                          checkbox-color="accent"
                        >
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="NIS"
                    readonly
                    filled
                    outlined
                    :value="penalty.Member.nisn"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Nama Member"
                    readonly
                    filled
                    outlined
                    :value="penalty.Member.nama"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Kelas"
                    readonly
                    filled
                    outlined
                    :value="penalty.Member.kelas"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="No HP"
                    readonly
                    filled
                    outlined
                    :value="penalty.Member.no_hp"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <hr class="mb-4">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="form.jenis"
                    :error-messages="v$.jenisP.$error ? v$.jenisP.$errors[0].$message : null"
                    filled
                    outlined
                    label="Jenis Pelanggaran"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="form.denda"
                    label="Nominal Denda"
                    :error-messages="v$.denda.$error ? v$.denda.$errors[0].$message : null"
                    filled
                    outlined
                    type="number"
                  ></v-text-field>
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
import { defineComponent, onMounted, reactive, ref, computed } from '@vue/composition-api'
import { mdiImage, mdiClose, mdiCloseBox, mdiMagnify, mdiBookSearch, mdiAccountSearch } from '@mdi/js'
import useValidate from '@vuelidate/core'
import { required, helpers, maxLength } from '@vuelidate/validators'
import axios from 'axios'
import Swal from 'sweetalert2'

export default defineComponent({
  props: {
    data: Object,
    dialog: Boolean,
  },
  setup(props, ctx) {
    const penalty = props.data
    const form = reactive({
      jenis: penalty.jenis,
      denda: penalty.denda
    })
    const memberHeader = ref([
      { text: 'ID MEMBER', value: 'member_id' },
      { text: 'Nama', value: 'nama' },
      { text: 'Kelas', value: 'kelas' },
      { text: 'Actions', value: 'actions', sortable: false },
    ])
    const memberDialog = ref(false)
    const searchMember = ref('')
    const selectedMember = ref([])
    const members = ref()

    const validator = computed(() => {
      return {
        jenis: {
          required: helpers.withMessage('Tidak Boleh Kosong!', required),
        },
        denda: {
          required: helpers.withMessage('Tidak Boleh Kosong!', required),
        },
      }
    })
    const v$ = useValidate(validator, form)

    onMounted(() => {
      v$.value.$validate()
    })

    const close = () => {
      ctx.emit('close')
    }
    const save = async () => {
      const reqBody = {
        jenis: form.jenis,
        denda: form.denda,
      }
      const response = await axios.post(`/penalties/edit/${penalty.id}`, reqBody)

      if (response.data.error) {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: response.data.msg
        })
      } else {
        Swal.fire({
          toast: true,
          position: 'top-right',
          icon: 'success',
          title: response.data.msg
        })
        ctx.emit('close')
      }
    }

    return {
      icon: { mdiImage, mdiClose, mdiCloseBox, mdiMagnify, mdiBookSearch, mdiAccountSearch },
      form,
      memberHeader,
      memberDialog,
      members,
      searchMember,
      selectedMember,
      close,
      save,
      v$,
      penalty
    }
  },
})
</script>
