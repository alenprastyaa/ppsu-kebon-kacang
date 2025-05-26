<script>
import axios from "axios";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";

export default {
  data() {
    return {
      reports: [],
      table: null,
    };
  },

  async created() {
    await this.fetchReports();
    this.$nextTick(() => {
      this.initDataTable();
    });
  },

  methods: {
    async fetchReports() {
      try {
        const response = await axios.get("https://api-v1.sipki.my.id/reports");
        this.reports = response.data;
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    },

    initDataTable() {
      if (this.table) {
        this.table.destroy();
      }
      this.table = new DataTable(this.$refs.reportsTable);
    },
  },
};
</script>

<template>
  <div class="relative flex items-center justify-center mt-5">
    <div class="max-w-7xl w-full bg-white p-6 rounded-lg shadow-lg relative">
      <router-link to="/admin">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Coat_of_arms_of_Jakarta.svg/800px-Coat_of_arms_of_Jakarta.svg.png"
          alt="Logo Kiri"
          class="absolute top-2 left-2 w-12 h-14"
        />
      </router-link>

      <h2 class="text-2xl font-semibold text-center text-gray-700 mt-14">
        Data Pekerjaan Lapangan
      </h2>

      <div class="mb-6 mt-8">
        <router-link
          to="/report"
          class="bg-slate-600 hover:bg-slate-500 py-3 px-4 text-white rounded-xl"
        >
          Buat Laporan
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table
          ref="reportsTable"
          class="min-w-full border-collapse border border-gray-300"
        >
          <thead class="bg-orange-600 text-white">
            <tr>
              <th>No</th>
              <th>Nama Petugas</th>
              <th>Nama Team</th>
              <th>Rw</th>
              <th>Tanggal</th>
              <th>Sumber Informasi</th>
              <th>Kondisi Lapangan</th>
              <th>Keterangan</th>
              <th>Lokasi</th>
              <th>Progres</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(report, index) in reports" :key="report.id">
              <td>{{ index + 1 }}</td>
              <td>{{ report.nama_petugas }}</td>
              <td>{{ report.nama_team }}</td>
              <td>{{ report.rw }}</td>
              <td>
                {{ new Date(report.tanggal).toLocaleDateString("id-ID") }}
              </td>
              <td>{{ report.sumber_informasi }}</td>
              <td>
                <img
                  v-if="report.kondisi_lapangan_gambar"
                  :src="`https://api-v1.sipki.my.id/uploads/${report.kondisi_lapangan_gambar}`"
                  class="w-20 h-20 object-cover mx-auto rounded-lg"
                />
              </td>
              <td>{{ report.keterangan_kondisi }}</td>
              <td>{{ report.lokasi_pekerjaan }}</td>
              <td>
                <img
                  v-if="report.progres_pekerjaan_gambar"
                  :src="`https://api-v1.sipki.my.id/uploads/${report.progres_pekerjaan_gambar}`"
                  class="w-20 h-20 object-cover mx-auto rounded-lg"
                />
              </td>
              <td>{{ report.keterangan_pekerjaan }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .max-w-7xl {
    width: 100%;
    padding: 4px;
  }
}
</style>
