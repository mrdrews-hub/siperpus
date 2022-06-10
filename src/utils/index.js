// eslint-disable-next-line object-curly-newline
import { getCurrentInstance, reactive, toRefs, watch } from '@vue/composition-api'

// Thanks: https://medium.com/better-programming/reactive-vue-routes-with-the-composition-api-18c1abd878d1
export const useRouter = () => {
  const vm = getCurrentInstance().proxy

  const state = reactive({
    route: vm.$route,
  })

  watch(
    () => vm.$route,
    r => {
      state.route = r
    },
  )

  return { ...toRefs(state), router: vm.$router }
}

export const _ = null

export const Rupiah = (money) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(money)
}

export const selisihHari = (date1, date2) => {
  const value1 = new Date(date1).getTime()
  const value2 = new Date(date2).getTime()
  const oneDay = 24 * 60 * 60 * 1000

  const diffday = Math.round(Math.round(value2 - value1) / oneDay)

  if (diffday > 0) {
    return 0
  } else {
    return diffday
  }
}

export const parseDate = (date) => {
  const bulanNumber = {
    0: 'Januari',
    1: 'Februari',
    2: 'Maret',
    3: 'April',
    4: 'Mei',
    5: 'Juni',
    6: 'Juli',
    7: 'Agustus',
    8: 'September',
    9: 'Oktober',
    10: 'November',
    11: 'Desember',
  }
  const Dates = new Date(date)
  const tanggal = Dates.getDate()
  const bulan = Dates.getMonth()
  const tahun = Dates.getFullYear()

  return `${tanggal} ${bulanNumber[bulan]} ${tahun}`
}
