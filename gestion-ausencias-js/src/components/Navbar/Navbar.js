export default {
  name: "Navbar",
  components: {},
  props: [],
  data() {
    return {
      imgURL: "",
      token: localStorage.getItem("token"),
      initials: localStorage.getItem("initials"),
      fullName: localStorage.getItem("name"),
      profilePhoto: "",
    };
  },
  computed: {},
  mounted() {},
  methods: {
    showMenu() {
      $("#profile-menu").fadeToggle(100);
    },
    logOut() {
      localStorage.clear();
      this.$router.push({ path: "/login" });
    },
    goToSettings() {
      $("#profile-menu").fadeOut(100);
      this.$router.push({ path: "/Perfil/Ajustes" });
    },
  },
  created() {
    this.profilePhoto = localStorage.getItem("profilePhoto") || "";
    console.log(localStorage.getItem("profilePhoto"));
  },
};
import $ from "jquery";

$(document).ready(function() {
  $("#show-mobile-menu").on("click", () => {
    $("#mobile-menu").slideToggle(300);
  });
});
