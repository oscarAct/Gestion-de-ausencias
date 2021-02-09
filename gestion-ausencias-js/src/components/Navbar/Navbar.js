export default {
  name: "Navbar",
  components: {},
  props: [],
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
};
import $ from "jquery";

$(document).ready(function() {
  $("#show-mobile-menu").on("click", () => {
    $("#mobile-menu").slideToggle(300);
  });
});
