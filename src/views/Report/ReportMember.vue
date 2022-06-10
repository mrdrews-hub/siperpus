<template>
  <section class="sheet padding-10mm">
    <div id="report">
        <header>
            <div class="header-img">
                <img class="sman4Logo" src="@/assets/images/logos/sman4.png" alt="">
            </div>
            <div class="header-title">
                <h2>LAPORAN DATA MEMBER</h2>
                <h1>SMA NEGERI 4 TASIKMALAYA</h1>
                <p>Jawa Barat, (32.78) Kota Tasikmalaya, (32.78.01) Cihideung, Jl. Letkol R.E. Djaelani Kel. Cilembang Kec. Cihideung</p>
            </div>
        </header>
        <hr><hr>
    <h2 style="text-align: center; margin-top: 12px;">PERIODE {{ parseDate(tglAwalReport) }} sampai {{ parseDate(tglAkhirReport) }}</h2>
      <table class="table">
        <thead>
          <tr>
            <th>NO.</th>
            <th>NISN</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Alamat</th>
            <th>no_hp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(member, index) in members" :key="member.id">
            <td class="text-center" width="20">{{ index + 1 }}</td>
            <td>{{ member.nisn }}</td>
            <td>{{ member.nama }}</td>
            <td>{{ member.kelas }}</td>
            <td>{{ member.alamat }}</td>
            <td>{{ member.no_hp }}</td>
          </tr>
        </tbody>
      </table>
      <div class="paraf">
        <div class="paraf-header">
         <p style="text-align: center; margin-bottom: -2px;">Tasikmalaya, {{ parseDate(Date.now()) }}</p>
         <p style="text-align: center;">Kepala Perpustakaan</p>
        </div>

        <p style="text-align: center; margin-top: 58px;">Teti Nurhayati, S.Pd</p>
      </div>
    </div>
  </section>
</template>
<script>
import { onMounted, ref, onBeforeMount } from '@vue/composition-api'
import html2pdf from 'html2pdf.js'
import axios from 'axios'
import { parseDate } from '@/utils'

export default {
//   props: {
//     membersData: Array
//   },
  setup (props, ctx) {
    const route = ctx.root.$route
    const members = ref([])
    const tglAwalReport = route.query.tgl_mulai
    const tglAkhirReport = route.query.tgl_akhir

    onMounted(async () => {
    const response = await axios.post('/report/member', {
        tgl_mulai: route.query.tgl_mulai,
        tgl_akhir: route.query.tgl_akhir,
    })
     if (response.data.error) {
         alert('terjadi kesalahan')
     } else {
         members.value = response.data
        const element = document.getElementById('report');
        const opt = {
        margin: 0.5,
        filename: 'member-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'in', format: 'legal', orientation: 'portrait' }
        }
        html2pdf().set(opt).from(element).save();
     }
    })

    return {
      members,
      parseDate,
      tglAwalReport,
      tglAkhirReport,
    }
  }
}
</script>
<style scoped>
.sheet {
    margin: 0 auto;
    max-width: 1100px;
}
#report {
  position: relative;
  min-height: 125vh;
}
#report header {
    display: flex;
    align-items: center;
}
.header-title {
    text-align: center;
}
.sman4Logo {
    width: 145px;
    height: 100px;
}
    h1 {
        font-weight: bold;
        font-size: 20pt;
        text-align: center;
    }
  
    table {
        border-collapse: collapse;
        width: 100%;
        margin-top: 22px;
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
.paraf {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
