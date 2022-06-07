<template>
  <v-container id="mainMember" fluid>
    <v-row>
      <v-col cols="4">
        <v-text-field
            v-model="search"
            label="Cari Pelanggaran"
            background-color="white"
            hide-details
            filled
            shaped
            outlined
            ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="pelanggaran"
          :loading="loading"
          :search="search"
          sort-by="name"
          dense
          class="elevation-1 flex"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>List Pelanggaran</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                dark
                class="mb-2"
                @click.stop="tambahDialog = true"
              >
                <v-icon>
                  {{ icon.mdiPlus }}
                </v-icon>
                Pelanggaran
              </v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <!-- EditUser -->
            <v-btn
              fab
              small
              class="mr-3"
              color="primary"
              @click="sendData(item)"
            >
              <v-icon>
                {{ icon.mdiPencil }}
              </v-icon>
            </v-btn>
            <v-btn
              fab
              small
              color="error"
              @click="deletePelanggaran(item)"
            >
              <v-icon>
                {{ icon.mdiDelete }}
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <add-penalty
        v-if="tambahDialog"
        :dialog="tambahDialog"
        :loading="loading"
        @close="closeDialog"
      />
      <edit-penalty
        v-if="editDialog"
        :dialog="editDialog"
        :loading="loading"
        :data="editData"
        @close="closeDialog"
      />
    </v-row>
  </v-container>
</template>
<script>
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import { mdiPencil, mdiDelete, mdiPlus, mdiCamera } from '@mdi/js'
import axios from 'axios'
import { Rupiah } from '@/utils'
import AddPenalty from '@/views/Pelanggaran/AddPenalty.vue'
import EditPenalty from '@/views/Pelanggaran/EditPenalty.vue'

export default defineComponent({
  components: { AddPenalty, EditPenalty },
    setup() {
    const headers = ref([
      { text: 'Nama', value: 'Member.nama' },
      { text: 'Kelas', value: 'Member.kelas' },
      { text: 'Jenis Pelanggaran', value: 'jenis' },
      { text: 'denda', value: 'denda' },
      { text: 'Actions', value: 'actions', sortable: false },
    ])
    const search = ref('')
    const editDialog = ref(false)
    const tambahDialog = ref(false)
    const editData = ref()
    const loading = ref(false)
    const pelanggaran = ref()

    const getPelanggaran = async () => {
      const response = await axios.get('/penalties')
      if (response.data.error) {
        alert('Cannot get Penalty')
      } else {
        pelanggaran.value = response.data.penalties
        console.log(pelanggaran.value);
      }
    }

    onMounted(() => {
      getPelanggaran()
    })

    const sendData = (item) => {
      editData.value = item
      editDialog.value = true
    }

    const deletePelanggaran = () => {

    }
    const closeDialog = () => {
      editDialog.value = false
      tambahDialog.value = false
      getPelanggaran()
    }

    return {
        icon: { mdiPencil, mdiDelete, mdiPlus, mdiCamera },
        headers,
        search,
        editDialog,
        tambahDialog,
        editData,
        loading,
        pelanggaran,
        deletePelanggaran,
        closeDialog,
        sendData,
    }

    },
})
</script>
