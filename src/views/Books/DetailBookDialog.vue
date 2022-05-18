<template>
  <v-row justify="center">
    <v-dialog
      v-model="detailDialog"
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="accent"
        >
          <v-toolbar-title>Detail Buku</v-toolbar-title>
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
        <v-card-text class="mt-4">
          <v-container fluid>
            <v-row>
              <v-col
                lg="4"
                sm="12"
                cols="4">
                <v-img
                  contain
                  :src="`http://localhost:3030/images/${book.image}`"
                ></v-img>
              </v-col>
              <v-col>
                <v-form readonly>
                  <v-col cols="12">
                    <v-text-field
                      v-model="book.title"
                      label="Book Title"
                      filled
                      required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="book.Rack.rack"
                      label="Rack"
                      filled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="book.Category.categories"
                      label="Category"
                      filled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="book.isbn"
                      label="ISBN"
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
                </v-form>
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
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
sc
<script>
import { defineComponent, toRefs } from '@vue/composition-api'
import { mdiImage, mdiClose, mdiCloseBox } from '@mdi/js'
import Swal from 'sweetalert2'
import axios from 'axios'

export default defineComponent({
  props: {
    detailDialog: Boolean,
    data: {
      type: Object,
      default(rawProps) {
        return { message: 'hello' }
      },
    },
  },

  setup(props, ctx) {
    const book = props.data
    const close = () => {
      ctx.emit('close')
    }

    return {
      icon: { mdiImage, mdiClose, mdiCloseBox },
      props,
      book,
      close,
    }
  },
})
</script>
