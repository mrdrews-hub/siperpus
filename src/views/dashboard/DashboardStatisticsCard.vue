<template>
  <v-card>
    <v-card-title class="align-start">
      <span class="font-weight-semibold">Statistics Card</span>
      <v-spacer></v-spacer>
      <v-btn
        icon
        small
        class="me-n3 mt-n2"
      >
        <v-icon>
          {{ icons.mdiDotsVertical }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-subtitle class="mb-8 mt-n5">
      <span class="font-weight-semibold text--primary me-1">Welcome Back </span>
      <span>😎</span>
    </v-card-subtitle>

    <v-card-text>
      <v-row>
        <v-col
          v-for="data in statisticsData"
          :key="data.title"
          cols="6"
          md="3"
          class="d-flex align-center"
        >
          <v-avatar
            size="44"
            :color="resolveStatisticsIconVariation (data.title).color"
            rounded
            class="elevation-1"
          >
            <v-icon
              dark
              color="white"
              size="30"
            >
              {{ resolveStatisticsIconVariation (data.title).icon }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              {{ data.title }}
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ data.total }}
            </h3>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { onMounted, ref } from '@vue/composition-api'
import { mdiAccountOutline, mdiRefresh, mdiBook, mdiTrendingUp, mdiDotsVertical, mdiLabelOutline } from '@mdi/js'
import axios from 'axios'

export default {
  setup() {
    const statisticsData = ref([
      {
        title: 'Peminjaman',
        total: '0',
      },
      {
        title: 'Pengembalian',
        total: '0',
      },
      {
        title: 'Total Buku',
        total: '0',
      },
      {
        title: 'Member',
        total: '0',
      },
    ])

    const getPeminjaman = async () => {
      try {
        const response = await axios.get('/borrow')
        if (response.data.error) {
          statisticsData.value[0].total = 0
        } else {
          const totalPeminjaman = response.data.Transaction.filter(trx => trx.dikembalikan === 'false')
          statisticsData.value[0].total = totalPeminjaman.length
        }
      } catch (error) {
        console.log(error.toString());
      }
    }
    const getPengembalian = async () => {
      try {
        const response = await axios.get('/borrow')
        if (response.data.error) {
          statisticsData.value[1].total = 0
        } else {
          const totalPengembalian = response.data.Transaction.filter(trx => trx.dikembalikan === 'true')
          statisticsData.value[1].total = totalPengembalian.length
        }
      } catch (error) {
        console.log(error.toString());
      }
    }
    const getBook = async () => {
      try {
        const response = await axios.get('/books')
        if (response.data.error) {
          statisticsData.value[2].total = 0
        } else {
          const totalBuku = response.data.books
          statisticsData.value[2].total = totalBuku.length
        }
      } catch (error) {
        console.log(error.toString());
      }
    }
    const getMember = async () => {
      try {
        const response = await axios.get('/members')
        if (response.data.error) {
          statisticsData.value[3].total = 0
        } else {
          const totalMembers = response.data.members
          statisticsData.value[3].total = totalMembers.length
        }
      } catch (error) {
        console.log(error.toString());
      }
    }

    onMounted(() => {
      getPeminjaman()
      getPengembalian()
      getBook()
      getMember()
    })

    const resolveStatisticsIconVariation = data => {
      if (data === 'Peminjaman') return { icon: mdiTrendingUp, color: 'primary' }
      if (data === 'Pengembalian') return { icon: mdiRefresh, color: 'success' }
      if (data === 'Total Buku') return { icon: mdiBook, color: 'warning' }
      if (data === 'Member') return { icon: mdiAccountOutline, color: 'info' }

      return { icon: mdiAccountOutline, color: 'success' }
    }

    return {
      statisticsData,
      resolveStatisticsIconVariation,

      // icons
      icons: {
        mdiDotsVertical,
        mdiTrendingUp,
        mdiAccountOutline,
        mdiLabelOutline,
        mdiRefresh,
        mdiBook,
      },
    }
  },
}
</script>
