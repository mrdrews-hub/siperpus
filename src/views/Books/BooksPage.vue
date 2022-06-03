<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
      <v-text-field
        v-model="search"
        label="Cari Buku"
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
          :items="books"
          :loading="loading"
          :search="search"
          sort-by="name"
          class="elevation-1"
        >
          <template v-slot:item.image="{ item }">
            <div class="d-flex justify-center py-2 px-2">
              <v-img v-if="item.image !== ''"
                     itemtype="image"
                     height="150"
                     width="160"
                     :src="`http://localhost:3030/images/${item.image}`"
              >
              </v-img>
              <v-img v-else
                     src="../../assets/images/default/diary.png"
                     height="150"
                     width="160"
              >
              </v-img>
            </div>
          </template>
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>List Book</v-toolbar-title>
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
                Add Book
              </v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              fab
              small
              class="mr-3"
              color="accent"
              @click.stop="sendData(item, 'todetail')"
            >
              <v-icon>
                {{ icon.mdiInformationVariant }}
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
              @click="deleteBook(item)"
            >
              <v-icon>
                {{ icon.mdiDelete }}
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12">
        <detail-book-dialog
          v-if="detailDialog"
          :detailDialog="detailDialog"
          :loading="loading"
          :data="editData"
          @close="closeDialog"
        />
        <edit-book-form
          v-if="editDialog"
          :editDialog="editDialog"
          :loading="loading"
          :data="editData"
          @save="saveEdit"
          @close="closeDialog"
        />
        <add-book-form
          v-if="tambahDialog"
          :tambahDialog="tambahDialog"
          :loading="loading"
          @save="addBook"
          @close="closeDialog"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mdiPencil, mdiDelete, mdiPlus, mdiInformationVariant } from '@mdi/js'
import Swal from 'sweetalert2'
// import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import {
  reactive, ref, onMounted, computed, watch, nextTick,
} from '@vue/composition-api'
import EditBookForm from './EditBookForm.vue'
import AddBookForm from './AddBookForm.vue'
import DetailBookDialog from './DetailBookDialog.vue'

export default {
  components: { EditBookForm, AddBookForm, DetailBookDialog },
  setup(props, context) {
    const headers = ref([
      { text: 'Image', value: 'image', sortable: false },
      { text: 'Title', value: 'title' },
      { text: 'Author', value: 'author' },
      { text: 'Penerbit', value: 'penerbit' },
      { text: 'Category', value: 'Category.categories' },
      { text: 'Rack', value: 'Rack.rack' },
      { text: 'Jumlah', value: 'stock' },
      { text: 'Actions', value: 'actions', sortable: false },
    ])
    const search = ref()
    const tambahDialog = ref(false)
    const editDialog = ref(false)
    const detailDialog = ref(false)
    const editData = ref()
    const loading = ref(false)
    const books = ref()
    const racks = ref()

    const getData = async () => {
      try {
        const { data } = await axios.get('/books')
        books.value = data.books
      } catch (error) {
        console.log('Server Error!', error.toString())
      }
    }


    onMounted(() => {
      getData()
    })
    const sendData = (item, to = null) => {
      editData.value = item
      if (to === 'todetail') {
        detailDialog.value = true
      } else {
        editDialog.value = true
      }
    }

    const addBook = async (payload) => {
      console.log(payload);
      loading.value = true
      try {
        const { data } = await axios.post('/books/create', payload)
        if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: data.msg,
          })
          loading.value = false
        } else {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'Buku Berhasil Dibuat',
            position: 'top-right',
          })
          loading.value = false
          getData()
          closeDialog()
        }
      } catch (err) {
        console.log(err.toString())
        loading.value = false
      }
    }

    const saveEdit = async (payload, id) => {
      console.log(payload, id)
      loading.value = true
      try {
        const { data } = await axios.put(`/books/edit/${id}`, payload)
        console.log(data);
        if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: data.msg,
          })
          loading.value = false
        } else {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'Rack Berhasil DiEdit',
            position: 'top-right',
          })
          closeDialog()
          getData()
          loading.value = false
        }
      } catch (err) {
        console.log(err.message);
        console.log(err.toString())
        loading.value = false
      }
    }

    const deleteBook = async (item) => {
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
          const { data } = await axios.delete(`/books/delete/${item.id}`)
          if (data.error) {
            return Swal.fire({
              icon: 'error',
              title: 'Tidak Dapat Menghapus',
              text: 'Buku ini mungkin sedang digunakan',
            })
          }
          Swal.fire({ toast: true, icon: 'success', title: 'Sukses!', position: 'top-right' })
          getData()
        }
      } catch (err) {
        console.log(err.toString())
      }
    }

    const closeDialog = () => {
      editDialog.value = false
      tambahDialog.value = false
      detailDialog.value = false
    }

    return {
      icon: { mdiPencil, mdiDelete, mdiPlus, mdiInformationVariant },
      headers,
      closeDialog,
      detailDialog,
      tambahDialog,
      editDialog,
      loading,
      books,
      addBook,
      deleteBook,
      sendData,
      saveEdit,
      racks,
      editData,
      search,
    }
  },
}
</script>

<style scoped lang="scss">
.formerror {
  color: red;
  font-size: small;
  margin-bottom: -18px;
}
</style>
