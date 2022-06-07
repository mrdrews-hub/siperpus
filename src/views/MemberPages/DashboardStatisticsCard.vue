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
      <span class="font-weight-semibold text--primary me-1">Welcome Back</span>
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
import { mdiDotsVertical, mdiBookVariant, mdiBookClock, mdiAlert, mdiBook } from '@mdi/js'

export default {
  setup() {
    const statisticsData = [
      {
        title: 'TotalBuku',
        total: '245',
      },
      {
        title: 'Peminjaman',
        total: '2',
      },
      {
        title: 'Status',
        total: 'Aktif',
      },
      // {
      //   title: 'Revenue',
      //   total: '$88k',
      // },
    ]

    const resolveStatisticsIconVariation = data => {
      if (data === 'TotalBuku') return { icon: mdiBookVariant, color: 'primary' }
      if (data === 'Peminjaman') return { icon: mdiBookClock, color: 'success' }
      if (data === 'Status') return { icon: mdiAlert, color: 'warning' }
      // if (data === 'Revenue') return { icon: mdiCurrencyUsd, color: 'info' }

      return { icon: mdiBook, color: 'success' }
    }

    return {
      statisticsData,
      resolveStatisticsIconVariation,

      // icons
      icons: {
        mdiDotsVertical, mdiBookVariant, mdiBookClock, mdiAlert, mdiBook
      },
    }
  },
}
</script>
