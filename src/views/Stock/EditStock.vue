<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-dialog
        v-model="dialog"
        persistent
        transition="dialog-bottom-transition"
        max-width="800"
      >
        <v-card>
          <v-toolbar
            dark
            color="accent"
          >
            <v-toolbar-title>Edit Stock</v-toolbar-title>
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
          <v-card-text class="mt-4 flex">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-dialog
                    max-width="700"
                    persistent
                    v-model="bookDialog">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :prepend-inner-icon="icon.mdiMagnify"
                        label="Pilih Buku"
                        readonly
                        solo
                        outlined
                        v-bind="attrs"
                        v-on="on"
                      >
                      </v-text-field>
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
                          :prepend-inner-icon="icon.mdiBookSearch"
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
                          single-select
                          checkbox-color="accent"
                        >
                        </v-data-table>
                      </v-card-text>
                      <v-card-actions class="flex justify-end">
                        <v-btn
                          color="primary"
                          elevation="3"
                          rounded
                          @click="bookDialog = false"
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    label="Judul Buku"
                    readonly
                    filled
                    outlined
                    :value="selectedBook[0].title"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Author"
                    readonly
                    filled
                    outlined
                    :value="selectedBook[0].author"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Penerbit"
                    readonly
                    filled
                    outlined
                    :value="selectedBook[0].penerbit"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    label="ISBN"
                    readonly
                    filled
                    outlined
                    :value="selectedBook[0].isbn"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Initial Stock"
                    readonly
                    filled
                    outlined
                    :value="selectedBook[0].stock"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <hr class="mb-4">
              <v-row>
                <v-col cols="6">
                  <v-select
                    v-model="form.status"
                    :items="['tambah', 'kurangi']"
                    :error-messages="v$.status.$error ? v$.status.$errors[0].$message : null"
                    filled
                    outlined
                    label="Tipe"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="form.jumlah"
                    label="Jumlah"
                    :error-messages="v$.jumlah.$error ? v$.jumlah.$errors[0].$message : null"
                    filled
                    outlined
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.info"
                    label="Keterangan"
                    filled
                    outlined
                  ></v-textarea>
                </v-col>
              </v-row>
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
  </v-row>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, computed } from '@vue/composition-api'
import { mdiImage, mdiClose, mdiCloseBox, mdiMagnify, mdiBookSearch } from '@mdi/js'
import useValidate from '@vuelidate/core'
import { required, helpers, maxLength } from '@vuelidate/validators'
import axios from 'axios'
import Swal from 'sweetalert2'

export default defineComponent({
  props: {
    dialog: Boolean,
    data: Object,
  },
  setup(props, ctx) {
      const stockData = props.data
    const form = reactive({
      status: '',
      jumlah: null,
      info: '',
    })
    const bookDialog = ref(false)
    const bookHeader = ref([
      { text: 'Judul', value: 'title' },
      { text: 'Author', value: 'author' },
      { text: 'Tahun', value: 'years' },
      { text: 'Stock', value: 'stock' },
    ])
    const books = ref([])
    const searchBook = ref('')
    const selectedBook = ref([])
    const validator = computed(() => {
      return {
        status: {
          required: helpers.withMessage('Tidak Boleh Kosong!', required),
        },
        jumlah: {
          required: helpers.withMessage('Tidak Boleh Kosong!', required),
        },
      }
    })
    const v$ = useValidate(validator, form)
    const getBooksData = async () => {
      try{
        const response = await axios.get('/books')
        books.value = response.data.books
      } catch (err) {
        console.log('Cannot GET Books', err.toString());
      }
    }

    onMounted(() => {
      getBooksData()
      selectedBook.value.push(stockData.Book)
      form.status = stockData.status
      form.jumlah = stockData.jumlah
      form.info = stockData.info
      v$.value.$validate()
    })

    const close = () => {
      ctx.emit('close')
    }

    const save = async () => {
      const reqBody = {
        bookId: selectedBook.value[0].id,
        status: form.status,
        jumlah: form.jumlah,
        info: form.info,
      }
      const response = await axios.put(`/stock/edit/${stockData.id}`, reqBody)
      if (response.data.error) {
        Swal.fire({
          icon: 'error',
          title: response.data.msg
        })
      } else {
        await Swal.fire({
          icon: 'success',
          title: response.data.msg
        })
        ctx.emit('close')
      }
    }

    return {
      icon: { mdiImage, mdiClose, mdiCloseBox, mdiMagnify, mdiBookSearch },
      form,
      books,
      close,
      save,
      v$,
      selectedBook,
      bookDialog,
      searchBook,
      bookHeader
    }
  },
})
</script>
