<template>
  <v-dialog
    v-model="showResult"
    max-width="800px"
    persistent
  >
    <v-card>
      <v-toolbar
        dark
        color="accent"
        class="mb-4"
      >
        <v-toolbar-title>Data Peminjaman</v-toolbar-title>
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
      <v-card-text>
        <v-container>
          <v-form readonly>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  :value="transaction.id_transaksi"
                  label="ID_TRANSASKI"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :value="transaction.tgl_pinjam"
                  label="Tanggal Pinjam"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :value="transaction.tgl_kembali"
                  label="Tanggal Kembali"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :value="`${Math.abs(selisihHari(Date.now(), transaction.tgl_kembali))} Hari`"
                  :error="selisihHari(Date.now(), transaction.tgl_kembali) < 0"
                  :success="selisihHari(Date.now(), transaction.tgl_kembali) >= 0"
                  label="Keterlambatan"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :value="Rupiah(transaction.denda)"
                  label="Denda"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>
            <v-row>
              <v-col cols="12"> Informasi Peminjam</v-col>
              <v-divider></v-divider>
              <v-col cols="4">
                <v-text-field
                  :value="transaction.Member.member_id"
                  label="ID MEMBER"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  :value="transaction.Member.nama"
                  label="Nama"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  :value="transaction.Member.kelas"
                  label="Kelas"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Judul Buku
                  </th>
                  <th class="text-left">
                    Author
                  </th>
                  <th class="text-left">
                    Penerbit
                  </th>
                  <th class="text-left">
                    Tahun
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in transaction.Borrowings"
                  :key="item.BookId"
                >
                  <td>{{ item.Book.title }}</td>
                  <td>{{ item.Book.author }}</td>
                  <td>{{ item.Book.penerbit }}</td>
                  <td>{{ item.Book.years }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
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
          rounded
          @click="kembalikan"
        >
          Kembalikan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { mdiCloseBox } from '@mdi/js'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Rupiah, selisihHari } from '@/utils'

export default defineComponent({
  props: {
    showResult: Boolean,
    data: Object,
  },
  setup(props, ctx) {
    const transaction = props.data

    const kembalikan = async () => {
      const response = await axios.put(`/borrow/return/${transaction.id}`)
      console.log(transaction);
      console.log(response);
      if(response.data.error) {
        alert('Something Wrong')
      } else {
        Swal.fire('NICE')
        close()
      }
    }
    const close = () => {
      ctx.emit('closeResult')
    }

    return {
      icon: { mdiCloseBox },
      transaction,
      close,
      Rupiah,
      selisihHari,
      kembalikan
    }
  },
})
</script>
