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
                     src="@/assets/images/default/diary.png"
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
import DetailBookDialog from './DetailBookDialog.vue'

export default {
  components: { DetailBookDialog },
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
    const detailDialog = ref(false)
    const loading = ref(false)
    const books = ref()
    const racks = ref()
    const editData = ref()
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
    const sendData = (item) => {
      editData.value = item
      detailDialog.value = true
    }

    const closeDialog = () => {
      detailDialog.value = false
    }

    return {
      icon: { mdiPencil, mdiDelete, mdiPlus, mdiInformationVariant },
      headers,
      closeDialog,
      detailDialog,
      loading,
      books,
      sendData,
      racks,
      search,
      editData
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
