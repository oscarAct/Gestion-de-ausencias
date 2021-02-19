import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/inicio",
    name: "Home",
    component: Home,
  },
  {
    path: "/",
    redirect: "/inicio",
  },
  {
    path: "/login",
    name: "Login",
    meta: { hideNavigation: true },
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/personal",
    name: "Personal",
    component: () => import("../views/Agents.vue"),
  },
  {
    path: "/perfil/ajustes",
    name: "Ajustes",
    component: () => import("../views/Settings.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
