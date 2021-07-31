<template>
  <div id="app">
    <Maintenance v-if="maintenance"></Maintenance>
    <Navbar v-if="!$route.meta.hideNavigation && !maintenance" />
    <Notice v-if="!$route.meta.hideNavigation && !maintenance && notice"></Notice>
    <router-view v-if="!maintenance" />
    <Footer v-if="!$route.meta.hideNavigation && !maintenance" />
  </div>
</template>
<script>
import Navbar from "./components/Navbar/index";
import Footer from "./components/Footer/index";
import Notice from "./components/Notice/index";
import Maintenance from "./components/Maintenance/index.vue";
import data from "./components/enviroments/development.config";
export default {
  name: "Home",
  components: {
    Navbar,
    Footer,
    Notice,
    Maintenance,
  },
  data() {
    return {
      token: null,
      maintenance: data.MAINTENANCE,
      notice: data.NOTICE
    };
  },
};
</script>
<style lang="scss">
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

#app {
  font-family:Poppins,Helvetica,sans-serif !important;
 -webkit-font-smoothing:antialiased;
 -moz-osx-font-smoothing:grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 12px !important;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.page {
  position: fixed;
  width: inherit;
}
.h-scrn {
  height: calc(100vh - 15.2vh);
}
</style>
