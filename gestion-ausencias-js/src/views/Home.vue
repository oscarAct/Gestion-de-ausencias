<template>
  <div class="home">
    <HomeIndex />
  </div>
</template>

<script>
// @ is an alias to /src
import HomeIndex from "../components/Home/index";

export default {
  name: "Home",
  components: {
    HomeIndex,
  },
};
</script>
