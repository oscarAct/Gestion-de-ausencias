import { Notyf } from "notyf";
import $ from "jquery";
import data from "../enviroments/development.config";
// Create an instance of Notyf
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
  name: "forgot-password",
  components: {},
  props: [],
  data() {
    return {
      email: "",
      API_URL: data.BASE_API_URL,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    recoverPassword(email) {
      if (email == "") {
        notyf.error("Favor ingresar correo.");
      } else {
        $(".linear-progress-material").fadeIn(200);
        const data = {
          email,
        };
        this.$http
          .put(this.API_URL + "user/recoverPassword", data, {
            foo: "Bar",
          })
          .then((res) => {
            $(".linear-progress-material").fadeOut(200);
            if (res.body.status) {
              notyf.success("Se envió la nueva contraseña al correo.");
            } else if (res.body.notFound) {
              notyf.error(
                "Este usuario no es usuario activo de la plataforma."
              );
            } else {
              notyf.error("Ha ocurrido un error inesperado.");
            }
          });
      }
    },
  },
};
