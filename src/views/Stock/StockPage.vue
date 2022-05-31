<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="stocks"
      :loading="loading"
      class="elevation-1"
    >
      <template v-slot:item.createdAt="{ item }">
        {{ new Date(item.createdAt).toLocaleDateString() }}
      </template>
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>List Stock</v-toolbar-title>
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
            Tambah Stock
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
          @click="editStock(item)"
        >
          <v-icon>
            {{ icon.mdiPencil }}
          </v-icon>
        </v-btn>
        <v-btn
          fab
          small
          color="error"
          @click="deleteStock(item)"
        >
          <v-icon>
            {{ icon.mdiDelete }}
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <add-stock
      v-if="tambahDialog"
      :dialog="tambahDialog"
      :loading="loading"
      @close="closeDialog"
    />
    <edit-stock
      v-if="editDialog"
      :dialog="editDialog"
      :data="editData"
      :loading="loading"
      @close="closeDialog"
    />
  </v-container>
</template>
<script>
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import axios from 'axios'
import { mdiPlus, mdiPencil, mdiDelete } from '@mdi/js'
import Swal from 'sweetalert2'
import AddStock from '@/views/Stock/AddStock.vue'
import EditStock from '@/views/Stock/EditStock.vue'

export default defineComponent({
    components: { AddStock, EditStock },
  setup() {
    const headers = ref([
      { text: 'Judul Buku', value: 'Book.title' },
      { text: 'Status', value: 'status' },
      { text: 'Jumlah', value: 'jumlah' },
      { text: 'Keterangan', value: 'info' },
      { text: 'Tanggal Buat', value: 'createdAt' },
      { text: 'Actions', value: 'actions', sortable: false },
    ])
    const tambahDialog = ref(false)
    const editDialog = ref(false)
    const stocks = ref()
    const loading = ref(false)
    const editData = ref()

    const getStockData = async () => {
      const response = await axios.get('/stock')
      stocks.value = response.data.Stock
    }
    onMounted(() => {
        getStockData()
    })

    const closeDialog = () => {
        tambahDialog.value = false
        editDialog.value = false
        getStockData()
    }

    const editStock = (item) => {
      editData.value = item
      editDialog.value = true
    }

    const deleteStock = async (item) => {
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Are you Sure ?',
          text: 'Data yang dihapus mungkin tidak dapat dikembalikan',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          confirmButtonColor: 'crimson',
        })
        if (result.isConfirmed) {
          const response = await axios.delete(`stock/delete/${item.id}`)
          if (response.data.error) {
            Swal.fire('Oops', 'Terjadi Kesalahan', 'error')
          } else {
            Swal.fire({
              toast: true,
              position: 'top-right',
              icon: 'success',
              title: 'Stock Berhasil Dihapus',
              timer: 1500
            })
            getStockData()
          }
        }
      
    }

    return {
      icon: { mdiPlus, mdiPencil, mdiDelete },
      headers,
      stocks,
      loading,
      tambahDialog,
      editDialog,
      editData,
      closeDialog,
      editStock,
      deleteStock,
    }
  },
})
</script>
