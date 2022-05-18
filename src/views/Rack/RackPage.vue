<template>
  <v-container id="mainRack" fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="racks"
          :loading="loading"
          sort-by="name"
          class="elevation-1 flex"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>List Rack</v-toolbar-title>
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
                Add Rack
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
              @click="deleteRack(item)"
            >
              <v-icon>
                {{ icon.mdiDelete }}
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12">
        <EditForm
          v-if="editDialog"
          :editDialog="editDialog"
          :loading="loading"
          :data="editData"
          @save="save"
          @close="closeDialog"
        />
        <AddRack
          v-if="tambahDialog"
          :tambahDialog="tambahDialog"
          :loading="loading"
          @save="addRack"
          @close="closeDialog"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mdiPencil, mdiDelete, mdiPlus, mdiCamera } from '@mdi/js'
import Swal from 'sweetalert2'
import {
  reactive, ref, onMounted, computed, watch, nextTick,
} from '@vue/composition-api'
import EditForm from './EditForm.vue'
import AddRack from './AddRack.vue'

export default {
  components: { EditForm, AddRack },
  setup(props, context) {
    const headers = ref([
      { text: 'Rack', value: 'rack' },
      { text: 'info', value: 'info' },
      { text: 'Actions', value: 'actions', sortable: false },
    ])
    const editDialog = ref(false)
    const tambahDialog = ref(false)
    const editData = ref()
    const loading = ref(false)
    const racks = ref()

    async function getData() {
      loading.value = true
      try {
        const { data } = await axios.get('/rack')
        racks.value = data.rack
        loading.value = false
        console.log(racks.value)
      } catch (error) {
        console.log('Server Error!', error.toString())
        loading.value = false
      }
    }

    onMounted(() => {
      getData()
    })

// Send Data to edit Dialog
    const sendData = (item) => {
      editData.value = item
      editDialog.value = true
    }


    const addRack = async (payload) => {
      loading.value = true
      const rackData = {
        rack: payload.rack,
        info: payload.info,
      }
      try {
        const { data, status, statusText } = await axios.post('/rack/create', rackData)
        console.log({ data, status, statusText })
        if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: data.msg,
          })
          loading.value = false
        } else {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'Rack Berhasil Dibuat',
            position: 'top-right',
          })
          loading.value = false
          closeDialog()
          getData()
        }
      } catch (err) {
        console.log(err.toString())
        loading.value = false
      }
    }

    const deleteRack = async (item) => {
      loading.value = true
      try {
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Are you Sure ?',
          text: 'Data yang dihapus mungkin tidak dapat dikembalikan',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          confirmButtonColor: 'crimson',
        })
        if (result.isConfirmed) {
          const { data } = await axios.delete(`/rack/delete/${item.id}`)
          Swal.fire({ toast: true, icon: 'success', title: 'Sukses!', position: 'top-right' })
          getData()
        }
        loading.value = false
      } catch (err) {
        console.log(err.toString())
        loading.value = false
      }
    }

    const save = async (payload) => {
      const rackEdited = {
        rack: payload.rack,
        info: payload.info,
      }
      console.log(rackEdited)
      try {
        loading.value = true
        const { data } = await axios.put(`/rack/edit/${payload.id}`, rackEdited)
        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'Rack Berhasil DiEdit',
          position: 'top-right',
        })
        loading.value = false
        closeDialog()
        getData()
      } catch (err) {
        console.log(err.message)
        loading.value = false
      }
    }

    const closeDialog = () => {
      tambahDialog.value = false
      editDialog.value = false
    }

    return {
      icon: { mdiPencil, mdiDelete, mdiPlus, mdiCamera },
      headers,
      loading,
      racks,
      editDialog,
      tambahDialog,
      editData,
      addRack,
      deleteRack,
      sendData,
      closeDialog,
      save,
    }
  },
}
</script>
