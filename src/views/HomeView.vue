<script>
import axios from "axios";

export default {
  data() {
    return {
      reports: [],
      teams: [],
      petugas: []
    };
  },

  async created() {
    await this.fetchReports();
    await this.fetchTeams();
    await this.fetchPetugas();
  },

  methods: {
    async fetchReports() {
      try {
        const response = await axios.get("http://localhost:5000/reports");
        this.reports = response.data;
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    },

    async fetchTeams() {
      try {
        const response = await axios.get("http://localhost:5000/teams");
        this.teams = response.data;
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    },

    async fetchPetugas() {
      try {
        const response = await axios.get("http://localhost:5000/petugas");
        this.petugas = response.data;
      } catch (error) {
        console.error("Error fetching petugas:", error);
      }
    },

    async deleteReport(id) {
      if (!confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
        return;
      }

      try {
        await axios.delete(`http://localhost:5000/reports/${id}`);
        this.reports = this.reports.filter(report => report.id !== id);
        alert("Laporan berhasil dihapus!");
      } catch (error) {
        console.error("Error deleting report:", error);
        alert("Gagal menghapus laporan!");
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
  },
};


</script>

<template>
  <div class="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg relative">
    <!-- Logo Kiri -->
    <img src="/logo-kiri.png" alt="Logo Kiri" class="absolute top-2 left-2 w-12 h-12" />
    
    <!-- Logo Kanan -->
    <img src="/logo-kanan.png" alt="Logo Kanan" class="absolute top-2 right-2 w-12 h-12" />
    
    <h2 class="text-2xl font-semibold text-center text-gray-700 mt-14">
      Data Pekerjaan Lapangan
    </h2>
    
    <div class="mb-8 mt-10 ">
      <router-link to="/about" class="bg-slate-600 py-2 px-2 text-white rounded-xl">
        Buat Laporan
      </router-link>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full table-auto border-collapse border border-gray-300">
        <thead class="bg-orange-600 text-white">
          <tr>
            <th class="px-4 py-2 border border-gray-100">No</th>
            <th class="px-4 py-2 border border-gray-100">Nama Petugas</th>
            <th class="px-4 py-2 border border-gray-100">Nama Team</th>
            <th class="px-4 py-2 border border-gray-100">Rw</th>
            <th class="px-4 py-2 border border-gray-100">Tanggal</th>
            <th class="px-4 py-2 border border-gray-100">Sumber Informasi</th>
            <th class="px-4 py-2 border border-gray-100">Kondisi Lapangan (Gambar)</th>
            <th class="px-4 py-2 border border-gray-100">Keterangan Kondisi</th>
            <th class="px-4 py-2 border border-gray-100">Lokasi Pekerjaan</th>
            <th class="px-4 py-2 border border-gray-100">Progres Pekerjaan (Gambar)</th>
            <th class="px-4 py-2 border border-gray-100">Keterangan Pekerjaan</th>
          </tr>
        </thead>
        
        <tbody>
          <tr v-for="(report, index) in reports" :key="report.id">
            <td class="px-4 py-2 border border-gray-100 text-center">{{ index + 1 }}</td>
            <td class="px-4 py-2 border border-gray-100">{{ report.nama_petugas }}</td>
            <td class="px-4 py-2 border border-gray-100">{{ report.nama_team }}</td>
            <td class="px-4 py-2 border border-gray-100">{{ report.rw }}</td>
            <td class="px-4 py-2 border border-gray-100">{{ formatDate(report.tanggal) }}</td>
            <td class="px-4 py-2 border border-gray-100">{{ report.sumber_informasi }}</td>
            <td class="px-4 py-2 border border-gray-100">
              <img v-if="report.kondisi_lapangan_gambar" :src="`http://localhost:5000/uploads/${report.kondisi_lapangan_gambar}`" class="w-full h-20 object-cover" />
            </td>
            <td class="px-4 py-2 border border-gray-100">{{ report.keterangan_kondisi }}</td>
            <td class="px-4 py-2 border border-gray-100">{{ report.lokasi_pekerjaan }}</td>
            <td class="px-4 py-2 border border-gray-100">
              <img v-if="report.progres_pekerjaan_gambar" :src="`http://localhost:5000/uploads/${report.progres_pekerjaan_gambar}`" class="w-full h-20 object-cover" />
            </td>
            <td class="px-4 py-2 border border-gray-100">{{ report.keterangan_pekerjaan }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .max-w-7xl {
    width: 100%;
    padding: 4px;
  }
  table {
    font-size: 12px;
  }
  th, td {
    padding: 6px;
  }
}
</style>
