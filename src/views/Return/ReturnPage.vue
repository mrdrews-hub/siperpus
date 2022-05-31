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
              <v-toolbar-title>List Categories</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                dark
                class="mb-2"
                @click.stop="dialog = true"
              >
                <v-icon>
                </v-icon>
                Add Category
              </v-btn>
            </v-toolbar>
          </template>

        </v-data-table>
    <h1>RETURNING PAGE</h1>
    <canvas id="QRCode" width="800" height="800"></canvas>
    <add-returns
      v-if="dialog"
      :dialog="dialog"
      @close="close"
    />
    <v-btn @click="onDialog"></v-btn>
  </v-container>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, watch } from '@vue/composition-api'
import { mdiCloseBox } from '@mdi/js'
import axios from 'axios'
import QRCode from 'qrcode'
import AddReturns from './AddReturns.vue'

export default {
  components: { AddReturns },
  setup() {
    const headers = ref([
      { text: 'id_transaksi', value: 'id_transaksi' },
      { text: 'info', value: 'info' },
      { text: 'Actions', value: 'actions', sortable: false },
    ])
    const returns = ref([
      {
        id_transaksi: 'ASDH712WH8D',
        info: 'asdasd'
      }
    ])
    const trxId = ref()
    const dialog = ref(false)
    const tes = ref()
    const loading = ref(false)
    const dataPinjam = ref()
    // const onScan = async (decodedText, decodedResult) => {
    //   trxId.value = decodedText
    //   const { data } = await axios.get(`borrow/detail/${decodedText}`)
    //   dataPinjam.value = data
    //   dialog.value = true
    // }
    // watch(trxId,
    //   async (oldVal, newVal) => {
    //     try {
    //       console.log(trxId.value);
    //       const { data } = await axios.get(`borrow/detail/${trxId.value}`)
    //       dataPinjam.value = data
    //       console.log(dataPinjam);
    //     } catch (error) {
    //       console.log(error.toString());
    //     }
    //   }
    // )
    onMounted(() => {
      QRCode.toCanvas(document.getElementById('QRCode'), '123asdwsdasdw', function(err) {
        if (err) console.log(err);
        console.log('QR Mounted');
      })
    })
    const onDialog = () => {
      dialog.value = true
    }
    const close = () => {
      dialog.value = false
    }

    return {
      icon: { mdiCloseBox },
      dialog,
      trxId,
      dataPinjam,
      onDialog,
      headers,
      returns,
      loading,
      close
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
