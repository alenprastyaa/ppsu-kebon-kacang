<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// import { useRouter } from "vue-router";

const reports = ref([]);
const sidebarOpen = ref(true);
const startDate = ref("");
const endDate = ref("");
const loading = ref(false);
const selectedRW = ref("01");
// const router = useRouter();

const fetchReports = async () => {
  try {
    const response = await axios.get("http://localhost:5000/reports");
    reports.value = response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date)) return "-"; // Cegah error jika format tidak valid

  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("id-ID", options); // Format ke bahasa Indonesia
};

const deleteReport = async (id) => {
  if (!confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
    return;
  }
  try {
    await axios.delete(`http://localhost:5000/reports/${id}`);
    reports.value = reports.value.filter((report) => report.id !== id);
    alert("Laporan berhasil dihapus!");
  } catch (error) {
    console.error("Error deleting report:", error);
    alert("Gagal menghapus laporan!");
  }
};

const downloadPDF = async () => {
  loading.value = true;

  if (!startDate.value || !endDate.value || !selectedRW.value) {
    alert("Silakan pilih RW dan rentang tanggal.");
    loading.value = false;
    return;
  }

  console.log("Selected RW:", selectedRW.value); // Debug: Cek apakah RW ada

  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(
    "LAPORAN HARIAN PELAKSANAAN PENANGANAN PRASARANA DAN SARANA UMUM",
    14,
    15
  );

  autoTable(doc, {
    startY: 20,
    theme: "plain", // Tidak menggunakan garis tebal
    body: [
      ["Kelurahan", ": Kebon Kacang"],
      ["Tanggal", `: ${formatDate(startDate.value)} - ${formatDate(endDate.value)}`],
      ["RW", `: ${selectedRW.value}`],
    ],
    styles: { fontSize: 10, cellPadding: 1 },
  });

  // **Filter data berdasarkan RW dan rentang tanggal**
  const filteredReports = reports.value.filter((report) => {
    if (!report.tanggal || !report.rw) return false;
    const reportDate = new Date(report.tanggal);
    return (
      reportDate >= new Date(startDate.value) &&
      reportDate <= new Date(endDate.value) &&
      report.rw === selectedRW.value
    );
  });

  if (filteredReports.length === 0) {
    alert("Tidak ada data dalam rentang tanggal yang dipilih.");
    loading.value = false;
    return;
  }


  // Proses gambar sebelum dimasukkan ke dalam PDF
  const processedReports = await Promise.all(
    filteredReports.map(async (report, index) => {
      const kondisiBase64 = report.kondisi_lapangan_gambar
        ? await getBase64Image(
            `http://localhost:5000/uploads/${report.kondisi_lapangan_gambar}`
          )
        : null;
      const progresBase64 = report.progres_pekerjaan_gambar
        ? await getBase64Image(
            `http://localhost:5000/uploads/${report.progres_pekerjaan_gambar}`
          )
        : null;

      return {
        no: index + 1,
        nama_petugas: report.nama_petugas || "-",
        nama_team: report.nama_team || "-",
        rw :report.rw || "_",
        tanggal: formatDate(report.tanggal),
        sumber_informasi: report.sumber_informasi || "-",
        kondisiBase64,
        keterangan_kondisi: report.keterangan_kondisi || "-",
        lokasi_pekerjaan: report.lokasi_pekerjaan || "-",
        progresBase64,
        keterangan_pekerjaan: report.keterangan_pekerjaan || "-",
      };
    })
  );

  // Buat tabel dengan gambar
  autoTable(doc, {
  head: [
    [
      "No",
      "Nama Petugas",
      "Nama Team",
      "Rw", // Dipindahkan agar urutannya benar
      "Tanggal",
      "Sumber Informasi",
      "Kondisi Lapangan (Gambar)",
      "Keterangan Kondisi",
      "Lokasi Pekerjaan",
      "Progres Pekerjaan (Gambar)",
      "Keterangan Pekerjaan",
    ],
  ],
  body: processedReports.map((report) => [
    report.no,
    report.nama_petugas,
    report.nama_team,
    report.rw, // ✅ Kolom Rw tetap kecil
    report.tanggal,
    report.sumber_informasi,
    {
      content: "",
      image: report.kondisiBase64 ? report.kondisiBase64 : null,
    },
    report.keterangan_kondisi,
    report.lokasi_pekerjaan,
    {
      content: "",
      image: report.progresBase64 ? report.progresBase64 : null,
    },
    report.keterangan_pekerjaan,
  ]),
  startY: 40,
  theme: "grid",
  margin: { left: 2, top: 2, right: 2 },
  headStyles: {
    fillColor: [0, 123, 255],
    textColor: 255,
    fontSize: 8,
    halign: "center",
  },
  bodyStyles: { valign: "middle", halign: "center", fontSize: 10 },
  columnStyles: {
    3: { cellWidth: 10 }, // ✅ Lebar lebih kecil untuk Rw
    4: { cellWidth: 20 }, // Lebar tanggal
    5: { cellWidth: 25 }, // Lebar Sumber Informasi
    6: { cellWidth: 30, minCellHeight: 22 }, // Kondisi Lapangan (Gambar)
    9: { cellWidth: 30, minCellHeight: 22 }, // Progres Pekerjaan (Gambar)
  },
  didDrawCell: (data) => {
    if (data.cell.raw?.image) {
      doc.addImage(
        data.cell.raw.image,
        "JPEG",
        data.cell.x + 2,
        data.cell.y + 2,
        27, // Lebar gambar sesuai dengan cellWidth
        18 // Tinggi gambar sesuai dengan cell
      );
    }
  },
});


  // Simpan PDF
  doc.save(`Laporan_Pekerjaan_RW_${selectedRW.value}.pdf`); // Nama file mengandung RW
  loading.value = false;
};

// Helper function untuk konversi URL gambar ke Base64
const getBase64Image = async (url) => {
  if (!url) return null;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image:", error);
    return null;
  }
};

onMounted(fetchReports);
</script>

<template>
  <div class="bg-blue-600">
    <span
      class="absolute text-white text-4xl top-5 left-4 cursor-pointer"
      @click="toggleSidebar"
    >
      <i class="bi bi-filter-left px-2 bg-gray-900 rounded-md"></i>
    </span>
    <div
      :class="{ '-left-full': !sidebarOpen, 'left-0': sidebarOpen }"
      class="sidebar fixed top-0 bottom-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900 transition-all duration-300 ease-in-out"
    >
      <div class="text-gray-100 text-xl">
        <div class="p-2.5 mt-1 flex items-center">
          <i
            class="bi bi-x cursor-pointer ml-auto lg:hidden"
            @click="toggleSidebar"
          ></i>
        </div>
        <div class="my-2 bg-gray-600 h-[1px]"></div>
      </div>
      <div
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-house-door-fill"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold">Home</span>
      </div>
      <div
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
        @click="$router.push('/team-petugas')"
      >
        <i class="bi bi-bookmark-fill"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold"
          >Team dan Petugas</span
        >
      </div>
      
      <div class="my-4 bg-gray-600 h-[1px]"></div>
    </div>
  </div>
  <div class="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-center text-gray-700 mb-6">
      Data Pekerjaan Lapangan
    </h2>
    <div>
    <div class="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
    <div class="filter-section flex space-x-4">
      <select v-model="selectedRW" class="border p-2 rounded">
        <option v-for="rw in 11" :key="rw" :value="rw.toString().padStart(2, '0')">
          RW {{ rw.toString().padStart(2, '0') }}
        </option>
      </select>
      <input type="date" v-model="startDate" class="border p-2 rounded" />
      <input type="date" v-model="endDate" class="border p-2 rounded" />
      <div v-if="loading">
        <button
          class="bg-red-200 p-3 text-white rounded-2xl cursor-not-allowed"
          @click="downloadPDF"
        >
          Download Loading ...
        </button>
      </div>
      <div v-else>
        <button
          class="bg-red-600 p-3 text-white rounded-2xl cursor-pointer"
          @click="downloadPDF"
        >
          Download PDF
        </button>
      </div>
    </div>
  </div>
  </div>
    <table class="min-w-full table-auto border-collapse border border-gray-300">
      <thead class="bg-blue-900 text-white">
        <tr>
          <th class="px-4 py-2 border border-gray-100">No</th>
          <th class="px-4 py-2 border border-gray-100">Nama Petugas</th>
          <th class="px-4 py-2 border border-gray-100">Nama Team</th>
          <th class="px-4 py-2 border border-gray-100">Rw</th>
          <th class="px-4 py-2 border border-gray-100">Tanggal</th>
          <th class="px-4 py-2 border border-gray-100">Sumber Informasi</th>
          <th class="px-4 py-2 border border-gray-100">
            Kondisi Lapangan (Gambar)
          </th>
          <th class="px-4 py-2 border border-gray-100">Keterangan Kondisi</th>
          <th class="px-4 py-2 border border-gray-100">Lokasi Pekerjaan</th>
          <th class="px-4 py-2 border border-gray-100">
            Progres Pekerjaan (Gambar)
          </th>
          <th class="px-4 py-2 border border-gray-100">Keterangan Pekerjaan</th>
          <th class="px-4 py-2 border border-gray-100">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(report, index) in reports" :key="report.id">
          <td class="px-4 py-2 border border-gray-100 text-center">
            {{ index + 1 }}
          </td>
          <td class="px-4 py-2 border border-gray-100">
            {{ report.nama_petugas }}
          </td>
          <td class="px-4 py-2 border border-gray-100">
            {{ report.nama_team }}
          </td>
          <td class="px-4 py-2 border border-gray-100">{{ report.rw }}</td>
          <td class="px-4 py-2 border border-gray-100">
            {{ formatDate(report.tanggal) }}
          </td>
          <td class="px-4 py-2 border border-gray-100">
            {{ report.sumber_informasi }}
          </td>
          <td class="px-4 py-2 border border-gray-100">
            <img
              v-if="report.kondisi_lapangan_gambar"
              :src="`http://localhost:5000/uploads/${report.kondisi_lapangan_gambar}`"
              class="w-full h-20 object-cover"
            />
          </td>
          <td class="px-4 py-2 border border-gray-100">
            {{ report.keterangan_kondisi }}
          </td>
          <td class="px-4 py-2 border border-gray-100">
            {{ report.lokasi_pekerjaan }}
          </td>
          <td class="px-4 py-2 border border-gray-100">
            <img
              v-if="report.progres_pekerjaan_gambar"
              :src="`http://localhost:5000/uploads/${report.progres_pekerjaan_gambar}`"
              class="w-full h-20 object-cover"
            />
          </td>
          <td class="px-4 py-2 border border-gray-100">
            {{ report.keterangan_pekerjaan }}
          </td>
          <td class="px-4 py-2 border border-gray-100 text-center">
            <button
              @click="deleteReport(report.id)"
              class="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800"
            >
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.filter-section {
  margin: 20px 0;
}

.filter-section input {
  margin-right: 10px;
  padding: 5px;
}
</style>
