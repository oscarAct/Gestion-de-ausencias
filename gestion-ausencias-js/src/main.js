import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles/app.css";
import VueResource from "vue-resource";
import VueTabulator from "vue-tabulator";

Vue.use(VueTabulator);
Vue.use(VueResource);
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
