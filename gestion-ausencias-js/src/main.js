import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles/app.css";
import VueResource from "vue-resource";
import VueTabulator from "vue-tabulator";
import Chartkick from "vue-chartkick";
import Highcharts from "highcharts";
import { Chart } from "chart.js";
import VueHtml2Canvas from "vue-html2canvas";

Vue.use(Chartkick.use(Chart));
Vue.use(Chartkick.use(Highcharts));
Chartkick.options = {
  colors: [
    "#011f4b",
    "#03396c",
    "#005b96",
    "#F8B195",
    "#F67280",
    "#C06C84",
    "#6C5B7B",
    "#355C7D",
    "#6497b1",
    "#b3cde0",
    "#051e3e",
    "#251e3e",
    "#451e3e",
    "#651e3e",
    "#851e3e",
  ],
};
Vue.use(VueTabulator);
Vue.use(VueResource);
Vue.use(VueHtml2Canvas);
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
