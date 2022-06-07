<template>
      <v-container fluid>
    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="search"
          label="Cari Peminjaman"
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
              <v-toolbar-title>Riwayat Peminjaman</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
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
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12">
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
import axios from 'axios'
import Swal from 'sweetalert2'
import DetailBorrow from './DetailBorrow.vue'

export default defineComponent({
    components: { DetailBorrow },
    setup(props, ctx) {
      const store = ctx.root.$store
    const headers = ref([
      { text: 'id_transaksi', value: 'id_transaksi' },
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
    const menu = ref(false)
    const date = ref((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10))

    const getBorrowingData = async () => {
      const response = await axios.get('/borrow')
      const thisTransaction = response.data.Transaction.filter(tr => tr.MemberId === store.state.user.id && tr.dikembalikan === 'true')
      borrows.value = thisTransaction
    }

    const sendData = (item) => {
      editData.value = item
        detailDialog.value = true
    }
    const closeDialog = () => {
      detailDialog.value = false
      getBorrowingData()
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
        menu,
        date
    }

    },
})
</script>
