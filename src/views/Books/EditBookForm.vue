<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-dialog
        v-model="editDialog"
        persistent
        transition="dialog-bottom-transition"
        max-width="800"
      >
        <v-card>
          <v-toolbar
            dark
            color="accent"
          >
            <v-toolbar-title>Edit Buku</v-toolbar-title>
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
          </v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="book.title"
                  label="Book Title"
                  :error-messages="v$.title.$error ? v$.title.$errors[0].$message : null"
                  filled
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="book.RackId"
                  :items="racks"
                  :error-messages="v$.RackId.$error ? v$.RackId.$errors[0].$message : null"
                  item-text="rack"
                  item-value="id"
                  label="Pilih Rack"
                  solo
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="book.CategoryId"
                  :items="categories"
                  item-text="categories"
                  item-value="id"
                  item-color="accent"
                  label="Pilih Category"
                  solo
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="book.isbn"
                  label="ISBN"
                  :error-messages="v$.isbn.$error ? v$.isbn.$errors[0].$message : null"
                  filled
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="book.author"
                  label="Author"
                  filled
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="book.years"
                  label="Release Date"
                  filled
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="book.info"
                  filled
                  name="input-7-4"
                  label="Info"
                  placeholder="(optional)"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row class="px-8 mb-4">
                <div>
                  <v-avatar
                    rounded
                    size="120"
                    class="me-6"
                  >
                    <!-- <v-img v-if="imageError" :src="preview"></v-img> -->
                    <v-img :src="preview" @error="onImageError"></v-img>
                  </v-avatar>
                </div>

                <!-- upload photo -->
                <div>
                  <v-btn
                    color="primary"
                    class="me-3 mt-5"
                    @click="$refs.refInputEl.click()"
                  >
                    <v-icon class="d-sm-none">
                      {{ icon.mdiCloudUploadOutline }}
                    </v-icon>
                    <span class="d-none d-sm-block">Upload new photo</span>
                  </v-btn>

                  <input
                    ref="refInputEl"
                    type="file"
                    accept=".jpeg,.png,.jpg,GIF"
                    :hidden="true"
                    @change="previewImage"
                  />

                  <v-btn
                    color="error"
                    outlined
                    class="mt-5"
                    @click="resetImage"
                  >
                    Reset
                  </v-btn>
                  <p class="text-sm mt-5">
                    Allowed JPG or PNG. Max size of 2MB
                  </p>
                </div>
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
sc
<script>
import { defineComponent, ref, reactive, computed, toRefs, onMounted } from '@vue/composition-api'
import { mdiImage, mdiClose, mdiCloseBox, mdiCloudUploadOutline } from '@mdi/js'
import useValidate from '@vuelidate/core'
import { required, helpers, maxLength } from '@vuelidate/validators'
import Swal from 'sweetalert2'
import axios from 'axios'

export default defineComponent({
  props: {
    editDialog: Boolean,
    data: {
      type: Object,
      default(rawProps) {
        return { message: 'hello' }
      },
    },
  },

  setup(props, ctx) {
    const { data } = toRefs(props)
    const racks = ref()
    const categories = ref()
    const book = reactive({
      id: data.value.id,
      title: data.value.title,
      author: data.value.author,
      years: data.value.years,
      isbn: data.value.isbn,
      RackId: { rack: data.value.Rack.rack, id: data.value.RackId },
      CategoryId: { categories: data.value.Category.categories, id: data.value.CategoryId },
      info: data.value.info,
      image: null,
    })
    const defaultImage = `http://localhost:3030/images/${data.value.image}`
    const preview = ref(`http://localhost:3030/images/${data.value.image}`)
    const getRack = async () => {
      try {
        const { data } = await axios.get('/rack')
        const rack = data.rack.map((item) => ({ id: item.id, rack: item.rack }))
        racks.value = rack
      } catch (error) {
        console.log('Server Error!', error.toString())
      }
    }
    const getCategortyList = async () => {
      try {
        const { data } = await axios.get('/categories')
        const category = data.categories.map((item) => ({ id: item.id, categories: item.categories }))
        categories.value = category
      } catch (error) {
        console.log('Server Error!', error.toString())
      }
    }
    const validator = computed(() => {
      return {
        title: {
          required: helpers.withMessage('Tidak Boleh Kosong!', required),
        },
        RackId: {
          required: helpers.withMessage('Tidak Boleh Kosong!', required),
        },
        isbn: {
          required: helpers.withMessage('Tidak Boleh Kosong!', required)
        },
      }
    })
    const v$ = useValidate(validator, book)
    onMounted(() => {
      getRack()
      getCategortyList()
      v$.value.$validate({})
    })

    const save = () => {
      console.log(data);
      console.log(book);
      if (v$.value.$error) {
        Swal.fire({
          icon: 'warning',
          title: 'validasi error',
          text: 'Silahkan Perbaiki dulu form yang berwarna merah 😉',
        })
      } else {
      const FD = new FormData()
      // eslint-disable-next-line no-restricted-syntax
        // for (const [key, value] of Object.entries(book)) {
        //   FD.append(key, value)
        // }
        // console.log(book.RackId.id);
        const RackId = typeof book.RackId === 'object' ? data.value.RackId : book.RackId
        const CategoryId = typeof book.CategoryId === 'object' ? data.value.CategoryId : book.CategoryId
        FD.append('title', book.title)
        FD.append('author', book.author)
        FD.append('years', book.years)
        FD.append('isbn', book.isbn)
        FD.append('info', book.info)
        FD.append('image', book.image)
        FD.append('RackId', RackId)
        FD.append('CategoryId', CategoryId)
        ctx.emit('save', FD, book.id)
      }
    }

    const close = () => {
      ctx.emit('close')
    }

    const resetImage = () => {
      preview.value = defaultImage
      book.image = null
    }

    const previewImage = (el) => {
      const image = el.target.files[0]
      if (image) {
        book.image = image
        const fr = new FileReader()
        fr.readAsDataURL(image)
        fr.onload = e => {
          preview.value = e.target.result
        }
      } else {
        return
      }
    }

    const onImageError = (el) => {
      console.log(el.target);
    }

    return {
      icon: { mdiImage, mdiClose, mdiCloseBox, mdiCloudUploadOutline },
      book,
      racks,
      categories,
      save,
      close,
      resetImage,
      v$,
      preview,
      previewImage,
      onImageError,
    }
  },
})
</script>
