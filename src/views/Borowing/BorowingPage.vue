<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="search"
          label="Cari Transaksi"
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
          :items="borrows"
          :loading="loading"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>List Peminjaman</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
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
                Tambah Peminjaman
              </v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              fab
              small
              class="mr-3"
              color="primary"
              @click="sendData(item, 'detail')"
            >
              <v-icon>
                {{ icon.mdiInformation }}
              </v-icon>
            </v-btn>
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
              @click="deleteBorrows(item)"
            >
              <v-icon>
                {{ icon.mdiDelete }}
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12">
        <edit-borrows-form
          v-if="editDialog"
          :editDialog="editDialog"
          :loading="loading"
          :data="editData"
          @save="saveEdit"
          @close="closeDialog"
        />
        <add-borrow-form
          v-if="tambahDialog"
          :tambahDialog="tambahDialog"
          :loading="loading"
          @close="closeDialog"
        />
        <detail-borrow
          v-if="detailDialog"
          :detailDialog="detailDialog"
          :loading="loading"
          :data="editData"
          @close="closeDialog"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { defineComponent, ref, onMounted, computed } from '@vue/composition-api'
import { mdiPencil, mdiDelete, mdiPlus, mdiInformation } from '@mdi/js'
import AddBorrowForm from './AddBorrowForm.vue'
import EditBorrowForm from './EditBorrowForm.vue'
import DetailBorrow from './DetailBorrow.vue'
import axios from 'axios'
import Swal from 'sweetalert2'

export default defineComponent({
    components: { AddBorrowForm, EditBorrowForm, DetailBorrow },
    setup() {
    const headers = ref([
      { text: 'id_transaki', value: 'id_transaksi' },
      { text: 'Nama Peminjam', value: 'Member.nama' },
      { text: 'Buku Dipinjam', value: 'Borrowings.length', align: 'center' },
      { text: 'Tanggal Pinjam', value: 'tgl_pinjam' },
      { text: 'Tanggal Kembali', value: 'tgl_kembali' },
      { text: 'Actions', value: 'actions', sortable: false },
    ])
    const search = ref('')
    const loading = ref(false)
    const tambahDialog = ref(false)
    const editDialog = ref(false)
    const detailDialog = ref(false)
    const borrows = ref()
    const editData = ref()

    const getBorrowingData = async () => {
      const response = await axios.get('/borrow')
      borrows.value = response.data.Transaction
    }

    const sendData = (item, to = null) => {
      editData.value = item
      if (to === 'detail') {
        detailDialog.value = true
      } else {
        editDialog.value = true
      }
    }
    const closeDialog = () => {
      editDialog.value = false
      tambahDialog.value = false
      detailDialog.value = false
      getBorrowingData()
    }

    const deleteBorrows = async (item) => {
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
          const { data } = await axios.delete(`/borrow/delete/${item.id}`)
          if (data.error) {
            return Swal.fire({
              icon: 'error',
              title: 'Terjadi Kesalahan',
            })
          }
          Swal.fire({ toast: true, icon: 'success', title: 'Sukses!', position: 'top-right', timer: 1500 })
          getBorrowingData()
        }
      } catch (err) {
        console.log(err.toString())
      }
    }

    const hitungHari = (hariIni, harikembali) => {
      const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
      const secondDate = harikembali.getTime();
      const diffDays = Math.round(Math.round((secondDate - hariIni) / (oneDay)));
      return diffDays
    }

    onMounted(() => {
      getBorrowingData()
    })

    return {
        icon: { mdiPencil, mdiDelete, mdiPlus, mdiInformation },
        headers,
        search,
        loading,
        tambahDialog,
        editDialog,
        borrows,
        editData,
        sendData,
        closeDialog,
        hitungHari,
        detailDialog,
        deleteBorrows,
    }

    },
})
</script>
<style scoped>

</style>