<template>
  <div id="app">
    <Navbar v-if="!$route.meta.hideNavigation" />
    <router-view />
    <Footer v-if="!$route.meta.hideNavigation" />
  </div>
</template>
<script>
import Navbar from "./components/Navbar/index";
import Footer from "./components/Footer/index";
export default {
  name: "Home",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      token: null,
    };
  },
};
</script>
<style lang="scss">
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
