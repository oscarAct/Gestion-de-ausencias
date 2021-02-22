import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import data from "../components/enviroments/development.config";
import axios from "axios";

Vue.use(VueRouter);

const routes = [
  {
    path: "/Inicio",
    name: "Home",
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token")) {
        next("/Login");
      } else {
        axios
          .get(data.BASE_API_URL + "token/isValid", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            if (res.data.isValid) {
              next();
            } else {
              next("/Login");
            }
          })
          .catch((err) => {
            next("/Login");
          });
      }
    },
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
    path: "/Personal/Colaboradores",
    name: "Personal",
    beforeEnter: (to, from, next) => {
      axios
        .get(data.BASE_API_URL + "token/isValid", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          if (res.data.isValid) {
            next();
          } else {
            next("/Login");
          }
        })
        .catch((err) => {
          next("/Login");
        });
    },
    component: () => import("../views/Agents.vue"),
  },
  {
    path: "/Perfil/Ajustes",
    name: "Ajustes",
    beforeEnter: (to, from, next) => {
      axios
        .get(data.BASE_API_URL + "token/isValid", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          if (res.data.isValid) {
            next();
          } else {
            next("/Login");
          }
        })
        .catch((err) => {
          next("/Login");
        });
    },
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
