<template>
  <v-container id="mainMember" fluid>
    <v-row>
      <v-col cols="4">
        <v-text-field
            v-model="search"
            label="Cari Member"
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
          :items="members"
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
              <v-toolbar-title>List Member</v-toolbar-title>
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
                Add Member
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
              @click="deleteMember(item)"
            >
              <v-icon>
                {{ icon.mdiDelete }}
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12">
        <EditCategoryForm
          v-if="editDialog"
          :editDialog="editDialog"
          :loading="loading"
          :data="editData"
          @save="editMember"
          @close="closeDialog"
        />
        <AddCategoryForm
          v-if="tambahDialog"
          :tambahDialog="tambahDialog"
          :loading="loading"
          @save="addMember"
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
import EditCategoryForm from './EditMemberForm.vue'
import AddCategoryForm from './AddMemberForm.vue'

export default {
  components: { EditCategoryForm, AddCategoryForm },
  setup(props, context) {
    const headers = ref([
      { text: 'ID', value: 'member_id' },
      { text: 'Nama', value: 'nama' },
      { text: 'Kelas', value: 'kelas' },
      { text: 'Alamat', value: 'alamat' },
      { text: 'No HP', value: 'no_hp' },
      { text: 'Actions', value: 'actions', sortable: false },
    ])
    const search = ref('')
    const editDialog = ref(false)
    const tambahDialog = ref(false)
    const editData = ref()
    const loading = ref(false)
    const members = ref()

    const getData = async () => {
      try {
        const { data } = await axios.get('/members')
        console.log(data);
        members.value = data.members
      } catch (error) {
        console.log('Server Error!', error.toString())
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


    const addMember = async (payload) => {
      loading.value = true
      const membersData = {
        nama: payload.nama,
        kelas: payload.kelas,
        alamat: payload.alamat,
        no_hp: payload.no_hp
      }
      try {
        const { data, status, statusText } = await axios.post('/members/create', membersData)
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
            title: 'Member Berhasil Dibuat',
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

    const deleteMember = async (item) => {
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
          const { data } = await axios.delete(`/members/delete/${item.id}`)
          Swal.fire({ toast: true, icon: 'success', title: 'Sukses!', position: 'top-right' })
          getData()
        }
        loading.value = false
      } catch (err) {
        console.log(err.toString())
        loading.value = false
      }
    }

    const editMember = async (payload) => {
      const membersEdited = {
        nama: payload.nama,
        kelas: payload.kelas,
        alamat: payload.alamat,
        no_hp: payload.no_hp
      }
      try {
        loading.value = true
        const { data } = await axios.put(`/members/edit/${payload.id}`, membersEdited)
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
            title: 'Member Berhasil DiEdit',
            position: 'top-right',
            timer: 600,
          })
          loading.value = false
          closeDialog()
          getData()
        }
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
      members,
      editDialog,
      tambahDialog,
      editData,
      addMember,
      deleteMember,
      sendData,
      closeDialog,
      editMember,
      search,
    }
  },
}
</script>
