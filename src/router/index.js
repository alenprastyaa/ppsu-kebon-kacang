import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ApiCall from "../views/ApiCall.vue";
import AdminView from "@/views/AdminView.vue";
import SidebarView from "@/views/SidebarView.vue";
import TeamDanPetugas from "@/views/TeamDanPetugas.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminView,
  },
  {
    path: "/team-petugas",
    name: "TeamDanPetugas",
    component: TeamDanPetugas,
  },
  {
    path: "/sidebar",
    name: "sidebar",
    component: SidebarView,
  },
  {
    path: "/report",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/api",
    name: "ApiCall",
    component: ApiCall,
  },
];

const router = createRouter({
  history: createWebHistory(), // Ganti dari createWebHashHistory()
  routes,
});

export default router;
