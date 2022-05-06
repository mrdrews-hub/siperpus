<template>
<v-data-table
  :headers="headers"
  :items="data"
  sort-by="name"
  class="elevation-1">

  <template v-slot:top>
    <v-toolbar
      flat>

      <v-toolbar-title>Edit User</v-toolbar-title>
      <v-divider
        class="mx-4"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog
        v-model="dialog"
        max-width="600px">

        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            class="mb-2"
            v-bind="attrs"
            v-on="on">
            <v-icon>
              {{ icon.mdiPlus }}
            </v-icon>
            Add User
          </v-btn>
        </template>
        <v-card :loading="loading">
          <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <!-- Kangge daftar -->
                <v-row v-if="formTitle == 'Add User'">
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.username"
                      label="username"
                      :error-messages="v$.username.$error ? v$.username.$errors[0].$message : null"
                      required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.email"
                      label="Email*"
                      :error-messages="v$.email.$error ? v$.email.$errors[0].$message : null"
                      required
                    >
                    </v-text-field>
                    <span class="formerror">{{ v$.email.$models }}</span>
                  </v-col>

                  <!-- Password -->
                  <div class="w-full">
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.password"
                        label="Password"
                        type="password"
                        :error-messages="v$.password.$error ? v$.password.$errors[0].$message : null"
                        required
                      >
                      </v-text-field>
                    </v-col>
                  </div>
                  <v-col cols="12">
                    <v-select
                      :items="['root','admin']"
                      v-model="form.role"
                      selected="root"
                      label="Role"
                      :error-messages="v$.role.$error ? v$.role.$errors[0].$message : null"
                    ></v-select>
                  </v-col>
                </v-row>

                <!-- Kangge Edit -->
                <v-row v-else>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editForm.username"
                      label="username"
                      
                      required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editForm.email"
                      label="Email*"
                      
                      required
                    >
                    </v-text-field>
                  </v-col>
                  <!-- Password -->
                  <div class="w-full">
                    <v-col cols="12">
                      <v-text-field
                        v-model="editForm.newpassword"
                        label="New Password"
                        type="password"
                        
                        required
                      >
                      </v-text-field>
                    </v-col>
                  </div>
                  <v-col cols="12">
                    <v-select
                      :items="['root','admin']"
                      v-model="editForm.role"
                      selected="root"
                      label="Role"
                      
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
              <v-divider></v-divider>
            <v-card-actions class="flex justify-end">
              <v-btn
                color="error"
                elevation="3"
                @click="dialog = false"
              >
                Close
              </v-btn>
              <v-btn
                v-if="formTitle == 'Add User'"
                color="primary"
                elevation="3"
                @click="save"
              >
                Save
              </v-btn>
              <v-btn
                v-else
                color="primary"
                elevation="3"
                @click="saveEdit"
              >
                Save
              </v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
  </template>

  <template v-slot:item.actions="{ item }">
    <!-- EditUser -->
    <v-btn
      fab
      small
      class="mr-3"
      color="primary"
      @click="editUser(item)">
      <v-icon>
        {{ icon.mdiPencil }}
      </v-icon>
    </v-btn>
      <v-btn
        fab
        small
        color="error"
        @click="deleteUser(item)">
        <v-icon>
          {{ icon.mdiDelete }}
        </v-icon>
      </v-btn>
  </template>
  <EditForm />
</v-data-table>
</template>

<script>
import axios from "axios"
import { mdiPencil, mdiDelete, mdiPlus } from '@mdi/js'
import Swal from "sweetalert2"
// import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import useValidate from '@vuelidate/core'
import { required, minLength, email, sameAs, helpers, requiredIf } from '@vuelidate/validators'
import { reactive, ref, onMounted, computed, watch, nextTick } from "@vue/composition-api"
import EditForm from '@/views/user/EditForm.vue'

export default {
  components: { EditForm },
  setup(props, context) {
    const dialog = ref(false)
    const editDialog = ref(false)
    const loading = ref(false)
    const editedIndex = ref(-1)
    const data = ref()
    const form = reactive({
      username: '',
      email: '',
      password: '',
      newpassword: '',
      role: ''
    })

    const custom = reactive({
      required: helpers.withMessage('Tidak Boleh Kosong!', required),
    })

    const validator = computed(() => {
      return {
        username: { 
          required: custom.required,
        },
        email: { required, email },
        password: { required, minLength: minLength(4) },
        // password2: { sameAs: helpers.withMessage('Password tidak sama', sameAs(form.password))},
        role: { required: custom.required }
      }
    })

    const editForm = ref({
      id: '',
      username: '',
      email: '',
      newpassword: '',
      role: ''
    })

    const formTitle = computed(() => {
      return editedIndex.value === -1 ? 'Add User' : 'Edit User'
    })
    
    watch(dialog, (val) => val || close())
    watch(editDialog, (val) => val || closeEdit())

    // dataTables Headers
    const headers = ref([
      { text: 'Username', value: 'username' },
      { text: 'Email', value: 'email' },
      { text: 'Role', value: 'role' },
      { text: 'Actions', value: 'actions', sortable: false },
    ])

    async function getData() {
      try{
          const response = await axios.get('/auth')
          data.value = response.data
      } catch (error){
          console.log('Server Error!');
      }
    }

    const v$ = useValidate(validator, form)

    onMounted(() => {
      getData()
      v$.value.$validate()
    })


    const save = async () => {
      loading.value = true
      if (v$.value.$error) {
        Swal.fire({
          icon: 'warning',
          title: 'validasi error',
          text: 'Silahkan Perbaiki dulu form yang berwarna merah 😉'
        })
        loading.value = false
        return
      } else {
        const registered = {
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
        }
        try {
          const response = await axios.post('/auth/register', registered)
          console.log(response.data);
          if(response.data.error){
            Swal.fire({
              icon:'warning',
              title: response.data.msg,
            })
            loading.value = false
            return
          }
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'User Berhasil Ditambahkan',
            position: 'top-right'
          })
          getData()
          loading.value = false
          dialog.value = false
        } catch (err) {
          console.log(err.message);
          loading.value = false
        }
      }
    }
    const editUser = (item) => {
      editedIndex.value = data.value.indexOf(item)
      editForm.value = Object.assign({}, {
        id: item.id,
        username: item.username,
        email: item.email,
        oldpassword: item.password,
        role: item.role,
        newpassword: '',
      })
      dialog.value = true
    }
    const saveEdit = async () => {
      const userEdited = {
        id: editForm.value.id,
        username: editForm.value.username,
        email: editForm.value.email,
        password: editForm.value.newpassword,
        role: editForm.value.role
      }
      try {
        loading.value = true
        const { data } = await axios.put('/auth/edit', userEdited)
        if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: data.msg.errors[0].message
          })
          loading.value = false
          return
        } else {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'User Berhasil DiEdit',
            position: 'top-right'
          })
          loading.value = false
          close()
          getData()
        }
      } catch (err) {
        console.log(err.message);
        loading.value = false
      }
    }
    const deleteUser = async(item) => {
      try {
        Swal.fire({
          icon: 'warning',
          title: 'Are you Sure ?',
          text: 'Data yang dihapus mungkin tidak dapat dikembalikan',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          confirmButtonColor: 'crimson'
        }).then((result) => {
          if(result.isConfirmed) {
            axios.delete(`/auth/${item.id}`).then(s => Swal.fire({toast:true, icon:'success', title:'Sukses!', position:'top-right'}))
            getData()
          }
        })
      } catch (err) {
        console.log(err.message);
      }
    }
    const close = () => {
      dialog.value = false
      nextTick(() => {
        editForm.value = Object.assign({})
        editedIndex.value = -1
      })
    }

    return {
      headers,
      dialog,
      editDialog,
      loading,
      data,
      form,
      v$,
      editForm,
      validator,
      formTitle,
      icon: { mdiPencil, mdiDelete, mdiPlus },
      save,
      saveEdit,
      editUser,
      deleteUser
    }
  }



  // data: () => ({
  //   dialog: false,
  //   dialogDelete: false,
  //   headers: [
  //     { text: 'Username', value: 'username' },
  //     { text: 'Email', value: 'email' },
  //     { text: 'Role', value: 'role' },
  //     { text: 'Actions', value: 'actions', sortable: false },
  //   ],
  //   icon:{ mdiPencil, mdiDelete, mdiPlus },
  //   editedIndex: -1,
  //   form: {
  //     username: '',
  //     email: '',
  //     password: '',
  //     password2: '',
  //     role: ''
  //   },
  //   data: [],
  // }),

  // validations: {
  //   form: {
  //     username: { required, minLength: minLength(4) },
  //     email: { required, email },
  //     password: { required, minLength: minLength(4) },
  //     password2: { sameAsPassword: sameAs('password') }
  //   }
  // },
  // watch: {
  //   dialog (val) {
  //     val || this.close()
  //   },
  // },
  // computed: {
  //   formTitle() {
  //     return this.editedIndex === -1 ? 'Add User' : 'Edit User'
  //   },
  //   isRegister() {
  //     return this.formTitle === 'Add User' ? true : false
  //   }
  // },

  // created() {
  //   this.$v.$touch()
  //   this.initialize()
  // },

  // methods: {
  //   async initialize() {
  //       try{
  //           const response = await axios.get('/auth')
  //           this.data = response.data
  //       } catch (error){
  //           console.log('Server Error!');
  //       }
  //   },

  //   editUser(item) {
  //       this.editedIndex = this.data.indexOf(item)
  //       this.form = Object.assign({}, item)
  //       this.dialog = true
  //   },

  //   async save() {
  //     if (this.$v.$invalid) {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Validasi Error',
  //         text: 'Perbaiki dulu Form yang berwarna merah 😉'
  //       })
  //       return
  //     } else {
  //       if (this.isRegister) {
  //         const registered = {
  //           username: this.form.username,
  //           email: this.form.email,
  //           password: this.form.password,
  //           role: this.form.role,
  //         }
  //         try {
  //           const response = await axios.post('/auth/register', registered)
  //           console.log(response.data);
  //           Swal.fire({
  //             toast: true,
  //             icon: 'success',
  //             title: 'User Berhasil Ditambahkan',
  //             position: 'top-right'
  //           })
  //           this.initialize()
  //           this.dialog = false
  //         } catch (err) {
  //           console.log(err.message);
  //         }
  //       }
  //     }
  //   },

  //   async edit() {
  //     if (this.$v.$invalid) {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Validasi Error',
  //         text: 'Perbaiki dulu Form yang berwarna merah 😉'
  //       })
  //       return
  //     } else {
  //         const registered = {
  //           username: this.form.username,
  //           email: this.form.email,
  //           password: this.form.password,
  //           role: this.form.role,
  //         }
  //         try {
  //           const response = await axios.put(`/auth/edit/${this.form.id}`, registered)
  //           console.log(response.data);
  //           Swal.fire({
  //             toast: true,
  //             icon: 'success',
  //             title: 'User Berhasil Ditambahkan',
  //             position: 'top-right'
  //           })
  //           this.initialize()
  //           this.dialog = false
  //         } catch (err) {
  //           console.log(err.message);
  //         }
  //     }
  //   },

  //   async deleteUser(item) {
  //     try {
  //       Swal.fire({
  //         icon: 'warning',
  //         title: 'Are you Sure ?',
  //         text: 'Data yang dihapus mungkin tidak dapat dikembalikan',
  //         showCancelButton: true,
  //         confirmButtonText: 'Yes',
  //         confirmButtonColor: 'crimson'
  //       }).then((result) => {
  //         if(result.isConfirmed) {
  //           axios.delete(`/auth/${item.id}`)
  //           Swal.fire({toast:true, icon:'success', title:'Sukses!', position:'top-right'})
  //           this.initialize()
  //         }
  //       })
  //     } catch (err) {
  //       console.log(err.message);
  //     }
  //   },
    
  //   close () {
  //     this.dialog = false
  //     this.$nextTick(() => {
  //       this.form = Object.assign({}, {})
  //       this.editedIndex = -1
  //     })
  //   },
  // }
}
</script>

<style scoped lang="scss">
.formerror {
  color: red;
  font-size: small;
  margin-bottom: -18px;
}
</style>
