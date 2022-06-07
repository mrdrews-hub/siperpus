<template>
  <section class="sheet padding-10mm">
    <div id="report">
        <header>
            <div class="header-img">
                <img class="sman4Logo" src="@/assets/images/logos/sman4.png" alt="">
            </div>
            <div class="header-title">
                <h2>LAPORAN PEMINJAMAN BUKU</h2>
                <h1>SMA NEGERI 4 TASIKMALAYA</h1>
                <p>Jawa Barat, (32.78) Kota Tasikmalaya, (32.78.01) Cihideung, Jl. Letkol R.E. Djaelani Kel. Cilembang Kec. Cihideung</p>
            </div>
        </header>
        <hr><hr>
    <h2 style="text-align: center; margin-top: 12px;">PERIODE GENAP 2022/2023</h2>
      <table class="table">
        <thead>
          <tr>
            <th>NO.</th>
            <th>ID_Peminjaman</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Buku Dipinjam</th>
            <th>tgl_pinjam</th>
            <th>tgl_kembali</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(borrow, index) in borrows" :key="borrow.id">
            <td class="text-center" width="20">{{ index + 1 }}</td>
            <td>{{ borrow.id_transaksi }}</td>
            <td>{{ borrow.Member.nama }}</td>
            <td>{{ borrow.Member.kelas }}</td>
            <td style="display:flex;" v-for="detail in borrow.Borrowings" :key="detail.id" rowspan="4">
              {{ detail.Book.title }}
            </td>
            <td>{{ borrow.tgl_pinjam }}</td>
            <td>{{ borrow.tgl_kembali }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
<script>
import { onMounted, ref, onBeforeMount } from '@vue/composition-api'
import html2pdf from 'html2pdf.js'
import axios from 'axios'

export default {
//   props: {
//     membersData: Array
//   },
  setup (props, ctx) {
    const route = ctx.root.$route
    const borrows = ref([])

    onMounted(async () => {
    const response = await axios.post('/report/borrow', {
        tgl_mulai: route.query.tgl_mulai,
        tgl_akhir: route.query.tgl_akhir,
    })
     if (response.data.error) {
         alert('terjadi kesalahan')
     } else {
         borrows.value = response.data
        const element = document.getElementById('report');
        const opt = {
        margin: 0.5,
        filename: 'laporan-peminjaman.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'in', format: 'legal', orientation: 'portrait' }
        }
        html2pdf().set(opt).from(element).save();
     }
    })

    return {
      borrows,
    }
  }
}
</script>
<style scoped>
.sheet {
    margin: 0 auto;
    max-width: 1100px;
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
</style>
