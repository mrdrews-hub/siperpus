<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3" v-for="card of reportCard" :key="card.title">
        <v-card
          class="mx-auto d-flex align-center report"
          max-width="344"
          height="150"
          outlined
          @click="cardClick(card.url)"
        >
          <v-row>
            <v-col cols="4" class="d-flex justify-center align-center">
              <v-icon
                x-large
              >{{ icon.mdiBook }}</v-icon>
            </v-col>
            <v-col cols="8">
              <h2 class="text-center">{{ card.title }}</h2>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="calendarDialog"
      persistent
      transition="dialog-bottom-transition"
      max-width="700"
    >
      <v-card
        :disabled="loading"
        :loading="loading">
        <v-card-title>
          <span class="text-h5">Tentukan Tanggal</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
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
                      label="Tanggal Mulai"
                      :prepend-icon="icon.mdiCalendar"
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
                      label="Tanggal Akhir"
                      :prepend-icon="icon.mdiCalendar"
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
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="flex justify-end">
          <v-btn
            color="error"
            elevation="3"
            rounded
            @click="calendarDialog = false"
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
    <report-member
      v-if="reportMember"
      :membersData="fetchData"
    />
  </v-container>
</template>
<script>
import { onMounted, ref } from '@vue/composition-api'
import html2pdf from 'html2pdf.js'
import { mdiBook, mdiCalendar } from '@mdi/js'
import axios from 'axios'
import ReportMember from '@/views/Report/ReportMember.vue'

export default {
  components: { ReportMember },
  setup (props, ctx) {
    const router = ctx.root.$router
    const calendarDialog = ref(false)
    const menu1 = ref(false)
    const menu2 = ref(false)
    const date1 = ref(new Date('2022-01-01').toISOString().substr(0, 10))
    const date2 = ref((new Date(Date.now() - (new Date()).getTimezoneOffset() * 1_080_000)).toISOString().substr(0, 10))
    const loading = ref(false)
    const urlReport = ref('')
    const fetchData = ref()
    const reportMember = ref(false)

    const reportCard = [
      {
        title: 'Laporan Peminjaman',
        icon: mdiCalendar,
        url: 'peminjaman',
        meta: 'peminjaman',
      },
      {
        title: 'Laporan Buku',
        icon: mdiCalendar,
        url: 'buku',
        meta: 'buku',
      },
      {
        title: 'Laporan Member',
        icon: mdiCalendar,
        url: 'member',
        meta: 'member',
      },
      // {
      //   title: 'Laporan Pelanggaran',
      //   icon: mdiCalendar,
      //   url: 'penalty',
      //   meta: 'penalty',
      // },
    ]

    const cardClick = (url) => {
      urlReport.value = url
      calendarDialog.value = true
      console.log(urlReport);
    }

    const save = async () => {
      let routeData
      switch (urlReport.value) {
        case 'peminjaman':
          routeData = router.resolve({ name: 'report.borrow', query: { tgl_mulai: date1.value, tgl_akhir: date2.value } });
          window.open(routeData.href, '_blank');
          break;
        case 'buku':
          routeData = router.resolve({ name: 'report.book', query: { tgl_mulai: date1.value, tgl_akhir: date2.value } });
          window.open(routeData.href, '_blank');
          break;
        case 'member':
          routeData = router.resolve({ name: 'report.member', query: { tgl_mulai: date1.value, tgl_akhir: date2.value } });
          window.open(routeData.href, '_blank');
          break;
        case 'penalty':

          break;
        default:
          console.log('error');
          break;
      }
      // console.log('tgl_mulai ' + date1.value);
      // console.log('tgl_akhir ' + date2.value);
      // console.log('url ' + urlReport.value);
      // try {
      //   const response = await axios.post(urlReport.value, {
      //     tgl_mulai: date1.value,
      //     tgl_akhir: date2.value,
      //   })
      //   console.log(response);
      //   if (response.data.error) {
      //     alert(`cannot get ${urlReport.value}`)
      //   } else {
      //     fetchData.value = response.data
      //     reportMember.value = true
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
    }

    return {
      icon: { mdiBook, mdiCalendar },
      reportCard,
      menu1,
      menu2,
      date1,
      date2,
      loading,
      calendarDialog,
      urlReport,
      cardClick,
      save,
      reportMember,
      fetchData
    }
  }
}
</script>
<style scoped>  
    h1 {
        font-weight: bold;
        font-size: 20pt;
        text-align: center;
    }
  
    table {
        border-collapse: collapse;
        width: 100%;
    }
  
    .table th {
        padding: 8px 8px;
        border:1px solid #000000;
        text-align: center;
    }
  
    .table td {
        padding: 3px 3px;
        border:1px solid #000000;
    }
  
    .text-center {
        text-align: center;
    }
    .report {
background: rgb(192,0,255);
background: linear-gradient(183deg, rgba(192,0,255,0.5634628851540616) 0%, rgba(0,255,158,0.5018382352941176) 98%);
    }
</style>
