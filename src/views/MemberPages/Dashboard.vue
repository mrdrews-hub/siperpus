<template>
  <v-row>
    <v-col
      cols="12"
    >
      <dashboard-statistics-card></dashboard-statistics-card>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import DashboardStatisticsCard from './DashboardStatisticsCard.vue'

export default defineComponent({
    components: { DashboardStatisticsCard },
    setup() {
        
    },
})
</script>
