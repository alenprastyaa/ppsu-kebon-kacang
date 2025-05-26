<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();

const showTextarea = ref(false);
const formData = ref({
  nama_petugas: "",
  nama_team: "",
  rw: "",
  tanggal: "",
  sumber_informasi: "",
  kondisi_lapangan_gambar: null,
  keterangan_kondisi: "",
  lokasi_pekerjaan: "",
  progres_pekerjaan_gambar: null,
  keterangan_pekerjaan: "",
  keterangan_lainnya: "",
});

const teams = ref([]);
const petugas = ref([]);

onMounted(async () => {
  try {
    const [teamsRes, petugasRes] = await Promise.all([
      axios.get("https://api-v1.sipki.my.id/teams"),
      axios.get("https://api-v1.sipki.my.id/petugas"),
    ]);

    teams.value = teamsRes.data;
    petugas.value = petugasRes.data;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
});

const handleKeteranganChange = (event) => {
  showTextarea.value = event.target.value === "lainnya";
};

const handleFileChange = (event, field) => {
  formData.value[field] = event.target.files[0];
};

const submitForm = async () => {
  try {
    const data = new FormData();
    Object.keys(formData.value).forEach((key) => {
      data.append(key, formData.value[key]);
    });

    await axios.post("https://api-v1.sipki.my.id/reports", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Laporan berhasil dikirim.",
      confirmButtonText: "OK",
    });

    router.push("/");
  } catch (error) {
    console.error("Terjadi kesalahan:", error);

    Swal.fire({
      icon: "error",
      title: "Gagal!",
      text: "Gagal mengirim laporan. Silakan coba lagi.",
      confirmButtonText: "OK",
    });
  }
};
</script>

<template>
  <div
    class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 relative"
  >
    <!-- Logo Kiri -->
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Coat_of_arms_of_Jakarta.svg/800px-Coat_of_arms_of_Jakarta.svg.png"
      alt="Logo Kiri"
      class="absolute top-2 left-2 w-10 h-12"
    />

    <h2 class="text-2xl font-semibold text-center text-gray-700 mb-6">
      Form Laporan Pekerjaan
    </h2>

    <form @submit.prevent="submitForm">
      <div class="grid gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600"
            >Nama Petugas</label
          >

          <select
            v-model="formData.nama_petugas"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="" disabled>Pilih Petugas</option>
            <option v-for="p in petugas" :key="p.id" :value="p.nama_petugas">
              {{ p.nama_petugas }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600"
            >Nama Team</label
          >
          <select
            v-model="formData.nama_team"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="" disabled>Pilih Team</option>
            <option v-for="t in teams" :key="t.id" :value="t.nama_team">
              {{ t.nama_team }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600">RW</label>
          <select
            v-model="formData.rw"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="" disabled selected>Pilih RW</option>
            <option
              v-for="n in 11"
              :key="n"
              :value="n.toString().padStart(2, '0')"
            >
              {{ n.toString().padStart(2, "0") }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600">Tanggal</label>
          <input
            v-model="formData.tanggal"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600"
            >Sumber Informasi</label
          >
          <select
            v-model="formData.sumber_informasi"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option disabled value="">Pilih Sumber Informasi</option>
            <option value="Hasil survey lapangan">
              Hasil survey lapangan oleh k...
            </option>
            <option value="Laporan dari masyarakat">
              Laporan dari masyarakat
            </option>
            <option value="Laporan dari Aplikasi CRM">
              Laporan dari aplikasi Qlue
            </option>
            <option value="Hasil koordinasi">Hasil koordinasi</option>
            <option value="Disposisi dari pimpinan">
              Disposisi dari pimpinan
            </option>
            <option value="Pekerjaan yang telah menjadi">
              Pekerjaan yang telah menjadi...
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600"
            >Kondisi Lapangan (Gambar)</label
          >
          <input
            type="file"
            @change="(e) => handleFileChange(e, 'kondisi_lapangan_gambar')"
            accept="image/*"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600"
            >Keterangan Kondisi Lapangan</label
          >
          <textarea
            v-model="formData.keterangan_kondisi"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600"
            >Lokasi Pekerjaan</label
          >
          <input
            v-model="formData.lokasi_pekerjaan"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600"
            >Progres Pekerjaan (Gambar)</label
          >
          <input
            type="file"
            @change="(e) => handleFileChange(e, 'progres_pekerjaan_gambar')"
            accept="image/*"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600"
            >Keterangan Pekerjaan</label
          >
          <select
            v-model="formData.keterangan_pekerjaan"
            @change="handleKeteranganChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="selesai">Selesai</option>
            <option value="belum selesai">Belum Selesai</option>
          </select>
        </div>

        <div v-if="showTextarea">
          <textarea
            v-model="formData.keterangan_lainnya"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          ></textarea>
        </div>
      </div>

      <div class="mt-6">
        <button
          type="submit"
          class="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Kirim Laporan
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  .max-w-md {
    width: 90%;
  }
}
</style>
