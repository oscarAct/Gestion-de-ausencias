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
    "#2f7ed8",
    "#0d233a",
    "#8bbc21",
    "#910000",
    "#1aadce",
    "#492970",
    "#f28f43",
    "#77a1e5",
    "#c42525",
    "#a6c96a",
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
