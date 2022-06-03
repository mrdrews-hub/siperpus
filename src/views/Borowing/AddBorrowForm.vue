<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-dialog
        v-model="tambahDialog"
        persistent
        transition="dialog-bottom-transition"
        max-width="800"
      >
        <v-card
          :disabled="loading"
          :loading="loading">
          <v-toolbar
            dark
            color="accent"
            class="mb-4"
          >
            <v-toolbar-title>Transaksi Peminjaman</v-toolbar-title>
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
              <v-row>
                <!-- Pilih Member -->
                <v-col cols="6">
                  <v-dialog
                    max-width="600"
                    v-model="memberDialog">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="`${form.member.member_id || ''}, ${form.member.nama || ''}`"
                        :prepend-inner-icon="icon.mdiAccountSearch"
                        label="Pilih Member"
                        outlined
                        filled
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-card>
                      <v-card-title class="flex justify-end">
                        <v-btn
                          @click="memberDialog = false"
                          fab>
                          <v-icon
                            color="error"
                            x-large>
                            {{ icon.mdiCloseBox }}
                          </v-icon>
                        </v-btn>
                      </v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="searchMember"
                          label="Cari Member"
                          outlined
                          filled
                          rounded
                        ></v-text-field>
                        <v-data-table
                          :headers="memberHeader"
                          :items="members"
                          :search="searchMember"
                        >
                          <template v-slot:item.actions="{ item }">
                            <v-btn
                              color="primary"
                              x-small
                              @click="tambahMember(item)"
                            >
                              Pilih
                            </v-btn>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-col>
                <!-- End Of Pilih Member -->

                <!-- Pilih Buku -->
                <v-col cols="6">
                  <v-dialog
                    max-width="700"
                    persistent
                    v-model="bookDialog">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="ListBookSelected"
                        :prepend-inner-icon="icon.mdiBookSearch"
                        label="Pilih Buku"
                        outlined
                        filled
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-card>
                      <v-card-title class="flex justify-end">
                        <v-btn
                          @click="bookDialog = false"
                          fab>
                          <v-icon
                            color="error"
                            x-large>
                            {{ icon.mdiCloseBox }}
                          </v-icon>
                        </v-btn>
                      </v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="searchBook"
                          label="Cari Buku"
                          outlined
                          filled
                          rounded
                        ></v-text-field>
                        <v-data-table
                          v-model="selectedBook"
                          :headers="bookHeader"
                          :items="books"
                          :search="searchBook"
                          item-key="title"
                          show-select
                          checkbox-color="accent"
                        >
                        </v-data-table>
                      </v-card-text>
                      <v-card-actions class="flex justify-end">
                        <v-btn
                          color="warning"
                          elevation="3"
                          rounded
                          @click="selectedBook = []"
                        >
                          Reset
                        </v-btn>
                        <v-btn
                          color="primary"
                          elevation="3"
                          rounded
                          @click="tambahBuku"
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
                <!-- End Of Pilih Buku -->

                <!-- CART BOOK -->
                <v-col cols="12">
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">
                            Judul
                          </th>
                          <th class="text-left">
                            Author
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="item in selectedBook"
                          :key="item.id"
                        >
                          <td>{{ item.title }}</td>
                          <td>{{ item.author }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
                <!-- END OF CART BOOK  -->

                <!-- Pilih Tanggal 1 -->
                <v-col cols="6">
                  <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date1"
                        label="Tanggal Pinjam"
                        :prepend-icon="icon.mdiCalendarClock"
                        readonly
                        outlined
                        filled
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date1"
                      reactive
                      @input="menu1 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- End Of Pilih Tanggal 1 -->

                <!-- Pilih Tanggal 2 -->
                <v-col cols="6">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date2"
                        label="Tanggal Kembali"
                        :prepend-icon="icon.mdiCalendarCheck"
                        readonly
                        outlined
                        filled
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date2"
                      reactive
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- End Of Pilih Tanggal 2 -->
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="flex justify-end">
            <v-btn
              color="error"
              elevation="3"
              rounded
              @click="close"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              elevation="3"
              rounded
              @click="save"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <show-qr-code
      v-if="QRDialog"
      :dialog="QRDialog"
      :text="QRText"
    />
  </v-row>
</template>

<script>
import {
  defineComponent, reactive, ref, onMounted, computed,
} from '@vue/composition-api'
import {
  mdiCalendarClock, mdiCalendarCheck, mdiCloseBox, mdiAccountSearch, mdiBookSearch,
} from '@mdi/js'
import QRCode from 'qrcode'
import axios from 'axios'
import MemberPage from '@/views/Member/MemberPage.vue'
import ShowQrCode from '@/components/ShowQrCode.vue'

export default defineComponent({
  components: { MemberPage, ShowQrCode },
  props: {
    tambahDialog: Boolean,
    loading: Boolean,
  },

  setup(props, ctx) {
    const memberHeader = ref([
      { text: 'ID MEMBER', value: 'member_id' },
      { text: 'Nama', value: 'nama' },
      { text: 'Actions', value: 'actions', sortable: false },
    ])
    const memberDialog = ref(false)
    const searchMember = ref('')
    const members = ref()

    const bookHeader = ref([
      { text: 'Judul', value: 'title' },
      { text: 'Author', value: 'author' },
      { text: 'Tahun', value: 'years' },
      { text: 'Stock', value: 'stock' },
    ])
    const bookDialog = ref(false)
    const searchBook = ref('')
    const books = ref()
    const selectedBook = ref([])
    const form = reactive({
      member: '',
      buku: null,
    })
    const date1 = ref((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10))
    const date2 = ref((new Date(Date.now() - (new Date()).getTimezoneOffset() * 1200000)).toISOString().substr(0, 10))
    const menu1 = ref(false) // for showing Date Picker 1
    const modal = ref(false)
    const menu2 = ref(false) // for showing Date Picker 2
    const QRDialog = ref(false)
    const QRText = ref('')

    const getMember = async () => {
      try {
        const response = await axios.get('/members')
        if (response.data.error) {
          console.log(response);
        } else {
          members.value = response.data.members
        }
      } catch (err) {
        console.log(err.toString());
      }
    }

    const getAllBook = async () => {
      try {
        const response = await axios.get('/books')
        if (response.data.error) {
          console.log(response)
        } else {
          const availableBooks = response.data.books.filter(book => book.stock > 0)
          console.log(availableBooks);
          books.value = availableBooks
        }
      } catch (error) {
        console.log(error.toString());
      }
    }

    const ListBookSelected = computed(() => {
      return selectedBook.value.forEach(el => el.title)
    })

    const close = () => {
      ctx.emit('close')
    }
    const save = async () => {
      const selectedBookId = selectedBook.value.map(book => book.id)
      const reqBodySchema = {
        memberId: form.member.id,
        books_id: selectedBookId,
        tgl_pinjam: date1.value,
        tgl_kembali: date2.value,
      }
      try {
        const response = await axios.post('/borrow/create', reqBodySchema)
        ctx.emit('close')
        // QRText.value = response.data.id
        // QRDialog.value = true
      } catch (error) {
        console.log(error.toString())
      }
    }
    const tambahMember = (item) => {
      form.member = { id: item.id, member_id: item.member_id, nama: item.nama }
      memberDialog.value = false
    }
    const tambahBuku = () => {
      bookDialog.value = false
      console.log(selectedBook.value);
    }
    const resetTambahBuku = () => {
      selectedBook.value = []
    }
    onMounted(() => {
      getMember()
      getAllBook()
      console.log(members.value);
    })

    return {
      icon: { mdiCalendarClock, mdiCalendarCheck, mdiCloseBox, mdiAccountSearch, mdiBookSearch },
      form,
      date1,
      date2,
      menu1,
      menu2,
      modal,
      memberHeader,
      memberDialog,
      searchMember,
      bookHeader,
      bookDialog,
      searchBook,
      selectedBook,
      members,
      books,
      close,
      save,
      tambahMember,
      tambahBuku,
      ListBookSelected,
      QRDialog,
      QRText
    }
  },
})
</script>
