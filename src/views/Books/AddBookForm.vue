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
            <v-toolbar-title>Tambah Buku</v-toolbar-title>
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
                <v-col cols="12">
                  <v-text-field
                    v-model="form.title"
                    label="Judul Buku"
                    :error-messages="v$.title.$error ? v$.title.$errors[0].$message : null"
                    filled
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-select
                    v-model="form.RackId"
                    :items="racks"
                    item-text="rack"
                    item-value="id"
                    :error-messages="v$.RackId.$error ? v$.RackId.$errors[0].$message : null"
                    label="Pilih Rack"
                    solo
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <v-select
                    v-model="form.CategoryId"
                    :items="categories"
                    item-text="categories"
                    item-value="id"
                    label="Pilih Category"
                    solo
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model.number="form.stock"
                    label="Jumlah Buku"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="form.author"
                    label="Author"
                    filled
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="form.years"
                    label="Tahun"
                    type="number"
                    filled
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.penerbit"
                    label="Penerbit"
                    filled
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.isbn"
                    label="ISBN"
                    :error-messages="v$.isbn.$error ? v$.isbn.$errors[0].$message : null"
                    type="number"
                    filled
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.info"
                    filled
                    name="input-7-4"
                    label="Info"
                    placeholder="(optional)"
                  ></v-textarea>
                </v-col>
                <!-- <v-col cols="12">
                  <v-file-input
                    v-model="form.bookImage"
                    color="accent"
                    label="Insert Book Cover"
                    placeholder="Select your files"
                    hide-input
                    :prepend-icon="icon.mdiImage"
                    show-size
                    @change="previewImage"
                    @click:clear="preview = ''"
                  >
                  <template v-slot:append-outer>
                  <v-img
                    contain
                    height="200"
                    width="180"
                    :src="preview"
                  ></v-img>
                  </template>
                  </v-file-input>
                </v-col> -->
                <v-row class="px-8 mb-4">
                  <div>
                    <v-avatar
                      rounded
                      size="180"
                      class="me-6"
                    >
                      <v-img
                        v-if="preview"
                        :src="preview"
                        width="180"
                        height="200"
                      ></v-img>
                      <v-sheet
                        v-else
                        color="secondary"
                        elevation="1"
                        height="180"
                        width="200"
                      ></v-sheet>
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
                      <span class="d-none d-sm-block">Upload photo</span>
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
                      @click="preview = null"
                    >
                      Reset
                    </v-btn>
                    <p class="text-sm mt-5">
                      Allowed JPG or PNG. Max size of 2MB
                    </p>
                  </div>
                </v-row>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
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
  </v-row>
</template>

<script>
import {
  defineComponent, reactive, computed, onMounted, ref,
} from '@vue/composition-api'
import { mdiImage, mdiCloseBox, mdiCloudUploadOutline } from '@mdi/js'
import useValidate from '@vuelidate/core'
import { required, helpers, alphaNum, and, or, numeric } from '@vuelidate/validators'
import Swal from 'sweetalert2'
import axios from 'axios'

export default defineComponent({
  props: {
    tambahDialog: Boolean,
    loading: Boolean,
    error: Array,
  },

  setup(props, ctx) {
    const preview = ref('')
    const form = reactive({
      title: '',
      author: '',
      years: '',
      penerbit: '',
      isbn: '',
      RackId: '',
      CategoryId: '',
      stock: '',
      info: '',
      image: null,
    })
    const racks = ref()
    const categories = ref()
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
    const v$ = useValidate(validator, form)

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

    onMounted(() => {
      getRack()
      getCategortyList()
      v$.value.$validate({})
    })

    const previewImage = (el) => {
      const image = el.target.files[0]
      if (image) {
        form.image = image
        const fr = new FileReader()
        fr.readAsDataURL(image)
        fr.onload = e => {
          preview.value = e.target.result
        }
      } else {
        return
      }
    }

    const save = async () => {
      if (v$.value.$error) {
        await Swal.fire({
          icon: 'warning',
          title: 'validasi error',
          text: 'Silahkan Perbaiki dulu form yang berwarna merah 😉',
        })
      } else {
        const data = new FormData()
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(form)) {
          data.append(key, value)
        }
        ctx.emit('save', data)
      }
    }

    const close = () => {
      ctx.emit('close')
    }

    return {
      icon: { mdiImage, mdiCloseBox, mdiCloudUploadOutline },
      form,
      save,
      close,
      v$,
      racks,
      categories,
      preview,
      previewImage,
    }
  },
})
</script>
