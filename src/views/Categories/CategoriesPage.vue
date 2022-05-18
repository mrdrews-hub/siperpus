<template>
  <v-container id="mainCategories" fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="categories"
          :loading="loading"
          sort-by="name"
          dense
          class="elevation-1 flex"
        >
        <template v-slot:item.Book
            :header="BookHeader"
            item="Hasimieiasd"
            value="HASIHDASD"
            >
        </template>
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
                @click.stop="tambahDialog = true"
              >
                <v-icon>
                  {{ icon.mdiPlus }}
                </v-icon>
                Add Category
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
              @click="deleteCategories(item)"
            >
              <v-icon>
                {{ icon.mdiDelete }}
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12">
        <EditCategoryForm
          v-if="editDialog"
          :editDialog="editDialog"
          :loading="loading"
          :data="editData"
          @save="editCategories"
          @close="closeDialog"
        />
        <AddCategoryForm
          v-if="tambahDialog"
          :tambahDialog="tambahDialog"
          :loading="loading"
          @save="addCategories"
          @close="closeDialog"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mdiPencil, mdiDelete, mdiPlus, mdiCamera } from '@mdi/js'
import Swal from 'sweetalert2'
import {
  reactive, ref, onMounted, computed, watch, nextTick,
} from '@vue/composition-api'
import EditCategoryForm from './EditCategoryForm.vue'
import AddCategoryForm from './AddCategoryForm.vue'

export default {
  components: { EditCategoryForm, AddCategoryForm },
  setup(props, context) {
    const headers = ref([
      { text: 'Categories', value: 'categories' },
      { text: 'info', value: 'info' },
      { text: 'Jumlah Buku', value: 'Books.length' },
      { text: 'Actions', value: 'actions', sortable: false },
    ])
    const editDialog = ref(false)
    const tambahDialog = ref(false)
    const editData = ref()
    const loading = ref(false)
    const categories = ref()

    const getData = async () => {
      try {
        const { data } = await axios.get('/categories')
        categories.value = data.categories
      } catch (error) {
        console.log('Server Error!', error.toString())
      }
    }

    onMounted(() => {
      getData()
    })

// Send Data to edit Dialog
    const sendData = (item) => {
      editData.value = item
      editDialog.value = true
    }


    const addCategories = async (payload) => {
      loading.value = true
      const categoriesData = {
        categories: payload.categories,
        info: payload.info,
      }
      try {
        const { data, status, statusText } = await axios.post('/categories/create', categoriesData)
        console.log({ data, status, statusText })
        if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: data.msg,
          })
          loading.value = false
        } else {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'Categories Berhasil Dibuat',
            position: 'top-right',
          })
          loading.value = false
          closeDialog()
          getData()
        }
      } catch (err) {
        console.log(err.toString())
        loading.value = false
      }
    }

    const deleteCategories = async (item) => {
      loading.value = true
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
          const { data } = await axios.delete(`/categories/delete/${item.id}`)
          Swal.fire({ toast: true, icon: 'success', title: 'Sukses!', position: 'top-right' })
          getData()
        }
        loading.value = false
      } catch (err) {
        console.log(err.toString())
        loading.value = false
      }
    }

    const editCategories = async (payload) => {
      const categoriesEdited = {
        categories: payload.categories,
        info: payload.info,
      }
      try {
        loading.value = true
        const { data } = await axios.put(`/categories/edit/${payload.id}`, categoriesEdited)
        if (data.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops',
              text: data.msg,
            })
            loading.value = false
        } else {
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'Categories Berhasil DiEdit',
              position: 'top-right',
              timer: 600
            })
            loading.value = false
            closeDialog()
            getData()
        }
      } catch (err) {
        console.log(err.message)
        loading.value = false
      }
    }

    const closeDialog = () => {
      tambahDialog.value = false
      editDialog.value = false
    }

    const getBooks = (item) => {
        if (item = 0) return 'error'
        else return 'accent'
    }
    const BookHeader = [
        {text:'tes', value:'title'}
    ]

    return {
      icon: { mdiPencil, mdiDelete, mdiPlus, mdiCamera },
      headers,
      loading,
      categories,
      editDialog,
      tambahDialog,
      editData,
      addCategories,
      deleteCategories,
      sendData,
      closeDialog,
      editCategories,
      getBooks,
      BookHeader
    }
  },
}
</script>
