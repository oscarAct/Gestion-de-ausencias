import $ from "jquery";
import { Notyf } from "notyf";
import data from "../enviroments/development.config";

const notyf = new Notyf({
  duration: 4000,
  position: {
    x: "right",
    y: "top",
  },
  types: [
    {
      type: "success",
      background: "#67c23a",
    },
    {
      type: "error",
      background: "#f56c6c",
    },
  ],
});

export default {
  name: "login",
  components: {},
  props: [],
  data() {
    return {
      API_URL: data.BASE_API_URL,
      loginData: {
        email: "",
        password: "",
        gettoken: true,
      },
    };
  },
  computed: {},
  mounted() {},
  methods: {
    login(data) {
      if (data.email.trim() == "" || data.password.trim() == "") {
        notyf.error("Ambos campos son obligatorios.");
      } else {
        $(".linear-progress-material").fadeIn(300);
        try {
          this.$http.post(this.API_URL + "user/login", data).then((res) => {
            $(".linear-progress-material").fadeOut(300);
            if (res.body.status) {
              localStorage.setItem("token", res.body.token);
              localStorage.setItem("name", res.body.name);
              localStorage.setItem("initials", res.body.initials);
              localStorage.setItem("profilePhoto", res.body.profilePhoto);
              this.$router.push({ path: "/" });
            } else {
              notyf.error("Credenciales incorrectas.");
            }
          });
        } catch (error) {
          console.log(error.message);
        }
      }
    },
  },
  created() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("initials");
  },
};
