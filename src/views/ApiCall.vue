<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const BaseUrl = "https://jsonplaceholder.typicode.com/posts";
const Data = ref();

onMounted(() => {
  axios.get(BaseUrl).then((ress) => {
    Data.value = ress.data;
    console.log(Data.value);
  });
});
</script>

<template>

  <div>
<div class="container m-auto">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Product name
                </th>
                <th scope="col" class="px-6 py-3">
                    Color
                </th>
                <th scope="col" class="px-6 py-3">
                    Category
                </th>
                <th scope="col" class="px-6 py-3">
                    Price
                </th>
            </tr>
        </thead>
        <tbody v-for="(post, index) in Data" :key="index">
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {{ index+1 }}
                </th>
                <td class="px-6 py-4">
                   {{ post.title }}
                </td>
                <td class="px-6 py-4">
                    {{ post.body }}
                </td>
                <td class="px-6 py-4">
                    $2999
                </td>
            </tr>
        </tbody>
    </table>
</div>

  </div>
</template>
