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
      profilePhoto: localStorage.getItem("profilePhoto"),
    };
  },
  computed: {},
  mounted() {},
  methods: {
    showMenu() {
      $("#profile-menu").fadeToggle(100);
    },
  },
};
import $ from "jquery";

$(document).ready(function() {
  $("#show-mobile-menu").on("click", () => {
    $("#mobile-menu").slideToggle(300);
  });
});
