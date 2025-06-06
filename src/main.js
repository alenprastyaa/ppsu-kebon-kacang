import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Swal from "sweetalert2";
window.Swal = Swal;

createApp(App).use(router).mount("#app");
