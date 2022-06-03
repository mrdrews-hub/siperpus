<template>
  <v-container>
    <v-dialog
      v-model="dialog"
      width="600"
    >
      <v-card>
      <v-toolbar
        dark
        color="accent"
        class="mb-4"
      >
        <v-toolbar-title></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            fab
            color="accent"
            small
            @click="closeScan"
          >
            <v-icon x-large color="error">{{ icon.mdiCloseBox }}</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
        <v-card-title class="flex justify-center">
          <h4>SCAN QR CODE</h4>
        </v-card-title>
        <v-card-text>
          <v-row justify="center">
            <qrcode-scanner
              :qrbox="250"
              :fps="10"
              style="width: inherit"
              @result="onScan"
            />
          </v-row>
          <v-row justify="center">
            <v-col cols="9">
              <v-text-field
                label="Input ID Transaksi"
                v-model="barcodeInput"
                filled
                outlined
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-btn
              color="primary"
              @click="onSubmit"
              >Submit</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <scan-result
      v-if="showResult"
      :showResult="showResult"
      :data="scanResult"
      @closeResult="close"
    />
  </v-container>
</template>
<script>
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import Swal from 'sweetalert2'
import axios from 'axios'
import { mdiCloseBox } from '@mdi/js'
import QrcodeScanner from '@/components/QrcodeScanner.vue'
import ScanResult from './ScanResult.vue'

export default {
  components: { QrcodeScanner, ScanResult },
  props: {
    dialog: Boolean,
    data: Object,
    loading: Boolean,
  },
  setup(props, ctx) {
    const dataPeminjaman = props.data
    const showResult = ref(false)
    const scanResult = ref()
    const barcodeInput = ref()
    const onScan = async (decodedText, decodedResult, scanner) => {
      const { data } = await axios.get(`borrow/detail/${decodedText}`)
      if (!data.id) {
        scanner.pause(true)
        Swal.fire({
          icon: 'error',
          title: 'Invalid Barcode'
        }).then(() => scanner.resume())
      } else {
        scanResult.value = data
        showResult.value = true
      }
    }
    const close = () => {
      showResult.value = false
    }
    const onSubmit = async () => {
      try {
        const { data } = await axios.get(`borrow/detail/${barcodeInput.value}`)
        console.log(data);
        if (!data.id) {
          Swal.fire({
            icon: 'error',
            title: 'ID TRANSAKSI TIDAK VALID',
            text: 'Silahkan periksa kembali'
          })
        } else {
          scanResult.value = data
          showResult.value = true
        }
      } catch (error) {
        console.log(error.toString());
      }
    }
    // const getData = async () => {
    //   const { data } = await axios.get(`borrow/detail/${props.trxId}`)
    //   dataPeminjaman.value = data
    //   console.log(dataPeminjaman);
    // }
    const closeScan = () => {
      ctx.emit('close')
    }

    return {
      icon: { mdiCloseBox },
      dataPeminjaman,
      showResult,
      scanResult,
      close,
      closeScan,
      onScan,
      onSubmit,
      barcodeInput
    }
  },
}
</script>
