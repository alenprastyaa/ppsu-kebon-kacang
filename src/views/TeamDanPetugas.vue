<script setup>
import { ref, onMounted } from "vue";

const sidebarOpen = ref(false);
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const petugasList = ref([]);
const teamList = ref([]);
const namaPetugas = ref("");
const namaTeam = ref("");

const fetchPetugas = async () => {
  const res = await fetch("https://api-v1.sipki.my.id/petugas");
  petugasList.value = await res.json();
};

const fetchTeams = async () => {
  const res = await fetch("https://api-v1.sipki.my.id/teams");
  teamList.value = await res.json();
};

import Swal from "sweetalert2";

// Menambahkan Petugas
const addPetugas = async () => {
  if (!namaPetugas.value) {
    Swal.fire({
      icon: "warning",
      title: "Peringatan",
      text: "Nama Petugas tidak boleh kosong!",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    await fetch("https://api-v1.sipki.my.id/petugas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_petugas: namaPetugas.value }),
    });

    namaPetugas.value = "";
    fetchPetugas();

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Petugas berhasil ditambahkan.",
      confirmButtonText: "OK",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal!",
      text: "Gagal menambahkan petugas.",
      confirmButtonText: "OK",
    });
  }
};

// Menambahkan Team
const addTeam = async () => {
  if (!namaTeam.value) {
    Swal.fire({
      icon: "warning",
      title: "Peringatan",
      text: "Nama Team tidak boleh kosong!",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    await fetch("https://api-v1.sipki.my.id/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_team: namaTeam.value }),
    });

    namaTeam.value = "";
    fetchTeams();

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Team berhasil ditambahkan.",
      confirmButtonText: "OK",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal!",
      text: "Gagal menambahkan team.",
      confirmButtonText: "OK",
    });
  }
};

// Menghapus Petugas dengan Konfirmasi
const deletePetugas = async (id) => {
  const result = await Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Data petugas yang dihapus tidak dapat dikembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  });

  if (!result.isConfirmed) return;

  try {
    await fetch(`https://api-v1.sipki.my.id/petugas/${id}`, {
      method: "DELETE",
    });
    fetchPetugas();

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Petugas berhasil dihapus.",
      confirmButtonText: "OK",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal!",
      text: "Gagal menghapus petugas.",
      confirmButtonText: "OK",
    });
  }
};

// Menghapus Team dengan Konfirmasi
const deleteTeam = async (id) => {
  const result = await Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Data team yang dihapus tidak dapat dikembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  });

  if (!result.isConfirmed) return;

  try {
    await fetch(`https://api-v1.sipki.my.id/teams/${id}`, { method: "DELETE" });
    fetchTeams();

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Team berhasil dihapus.",
      confirmButtonText: "OK",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal!",
      text: "Gagal menghapus team.",
      confirmButtonText: "OK",
    });
  }
};

onMounted(() => {
  fetchPetugas();
  fetchTeams();
});
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
        @click="$router.push('/admin')"
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
  <h1 class="text-center mt-20 text-2xl font-bold">DAFTAR PETUGAS DAN TEAM</h1>
  <div
    class="flex flex-row items-start min-h-screen bg-gray-100 p-6 gap-6 mt-20"
  >
    <div class="flex flex-col gap-6 w-1/2">
      <!-- Form Input Petugas -->
      <div class="w-full p-6 bg-white rounded-lg shadow-md m-auto">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
          Input Nama Petugas
        </h2>
        <form @submit.prevent="addPetugas">
          <div class="mb-4">
            <label
              for="nama_petugas"
              class="block text-sm font-medium text-gray-600"
              >Nama Petugas</label
            >
            <input
              v-model="namaPetugas"
              type="text"
              id="nama_petugas"
              class="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Masukkan nama petugas"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            DAFTAR
          </button>
        </form>
      </div>

      <!-- Form Input Team -->
      <div class="w-full p-6 bg-white rounded-lg shadow-md m-auto">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
          Input Nama Team
        </h2>
        <form @submit.prevent="addTeam">
          <div class="mb-4">
            <label
              for="nama_team"
              class="block text-sm font-medium text-gray-600"
              >Nama Team</label
            >
            <input
              v-model="namaTeam"
              type="text"
              id="nama_team"
              class="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Masukkan nama team"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            DAFTAR
          </button>
        </form>
      </div>
    </div>

    <div class="flex flex-col gap-6 w-1/2">
      <!-- Tabel Daftar Petugas -->
      <div class="w-full p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Daftar Petugas</h2>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 p-2">Nama Petugas</th>
              <th class="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="petugas in petugasList" :key="petugas.id">
              <td class="border border-gray-300 p-2">
                {{ petugas.nama_petugas }}
              </td>
              <td class="border border-gray-300 p-2 text-center">
                <button
                  @click="deletePetugas(petugas.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tabel Daftar Team -->
      <div class="w-full p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Daftar Team</h2>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 p-2">Nama Team</th>
              <th class="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="team in teamList" :key="team.id">
              <td class="border border-gray-300 p-2">{{ team.nama_team }}</td>
              <td class="border border-gray-300 p-2 text-center">
                <button
                  @click="deleteTeam(team.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
