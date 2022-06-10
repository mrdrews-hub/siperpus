<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="returns"
      :loading="loading"
      sort-by="name"
      dense
      class="elevation-1 flex"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>List Pengembalian</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            class="mb-2"
            @click.stop="dialog = true"
          >
            <v-icon>
              {{ icon.mdiPlus }}
            </v-icon>
            Pengembalian
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.Borrowings="{ item }">
        <p v-for="borrow in item.Borrowings" :key="borrow.id">
          {{ borrow.Book.title }}
        </p>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          fab
          small
          class="mr-3"
          color="primary"
          @click="sendData(item)"
        >
          <v-icon>
            {{ icon.mdiInformation }}
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:footer.prepend>
        <v-row>
          <v-col cols="4" class="mx-4">
            <v-dialog
              ref="dialogFilter"
              v-model="menuFilter"
              :return-value.sync="dateFilter"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateFilter"
                  label="Filter By"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateFilter"
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="menuFilter = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialogFilter.save(dateFilter)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
    <add-returns
      v-if="dialog"
      :dialog="dialog"
      @close="closeDialog"
    />
    <detail-return
      v-if="detailDialog"
      :detailDialog="detailDialog"
      :data="editData"
      @close="closeDialog"
    />
    </v-col>
  </v-container>
</template>
<script>
import {  onMounted, reactive, ref, watch } from '@vue/composition-api'
import { mdiCloseBox, mdiPlus, mdiInformation } from '@mdi/js'
import axios from 'axios'
import AddReturns from './AddReturns.vue'
import DetailReturn from './DetailReturn.vue'

export default {
  components: { AddReturns, DetailReturn },
  setup() {
    const headers = ref([
      { text: 'id_transaksi', value: 'id_transaksi' },
      { text: 'Member', value: 'Member.nama' },
      { text: 'Buku', value: 'Borrowings' },
      { text: 'Tanggal Pinjam', value: 'tgl_pinjam' },
      { text: 'Tanggal Kembali', value: 'tgl_kembali' },
      { text: 'dikembalikan_pada', value: 'Return.returnAt' },
      { text: 'Actions', value: 'actions', sortable: false },
    ])
    const returns = ref()
    const trxId = ref()
    const dialog = ref(false)
    const loading = ref(false)
    const dataPinjam = ref()
    const menuFilter = ref(false)
    const dateFilter = ref((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10))
    const detailDialog = ref(false)
    const editData = ref()

    const getReturnData = async () => {
      const response = await axios.get('/borrow')
      if (response.data.error) {
        alert('Server Error! Cannot GET Transaction')
      } else {
        const borrowActive = response.data.Transaction.filter(tr => tr.dikembalikan === 'true')
        returns.value = borrowActive
        console.log(returns.value);
      }
    }
    onMounted(() => {
      getReturnData()
    })

    const onDialog = () => {
      dialog.value = true
    }

    const sendData = (item) => {
      detailDialog.value = true
      editData.value = item
    }

    const closeDialog = () => {
      dialog.value = false
      detailDialog.value = false
      getReturnData()
    }

    return {
      icon: { mdiCloseBox, mdiPlus, mdiInformation },
      dialog,
      trxId,
      dataPinjam,
      onDialog,
      headers,
      returns,
      loading,
      closeDialog,
      menuFilter,
      dateFilter,
      detailDialog,
      editData,
      sendData
    }
  },
}
</script>
<style scoped>
canvas{
    width: 550px;
    height: 450px;
}
</style>
