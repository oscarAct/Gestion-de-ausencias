import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/Inicio",
    name: "Home",
    component: Home,
  },
  {
    path: "/",
    redirect: "/Inicio",
  },
  {
    path: "/Login",
    name: "Login",
    meta: { hideNavigation: true },
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/Personal/Empleados",
    name: "Personal",
    component: () => import("../views/Agents.vue"),
  },
  {
    path: "/Perfil/Ajustes",
    name: "Ajustes",
    component: () => import("../views/Settings.vue"),
  },
  {
    path: "/Cuenta/Recuperar",
    name: "RecuperarContrasena",
    meta: { hideNavigation: true },
    component: () => import("../views/forgotPassword.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
