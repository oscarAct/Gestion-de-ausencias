import vueFilePond from "vue-filepond";
import $ from "jquery";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import { Notyf } from "notyf";

import data from "../enviroments/development.config";
import firebase from "firebase";

//CSS Styles

import "filepond/dist/filepond.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginFileValidateSize,
  FilePondPluginImageEdit,
  FilePondPluginImageTransform
);

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
  name: "settings",
  components: { FilePond },
  props: [],
  data() {
    return {
      profilePic: [],
      users: [],
      changePassword: {
        oldPassword: "",
        newPassword: "",
      },
      newUser: {
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePhoto:
          "https://firebasestorage.googleapis.com/v0/b/gestor-de-archivos-34c41.appspot.com/o/absences%2Fusers%2Fprofile-photos%2F82827-unnamed.png?alt=media&token=28bc3150-02c6-4f6f-be77-4c786845ee30",
      },
      API_URL: data.BASE_API_URL,
      imgURL: "",
      token: localStorage.getItem("token"),
      user: {
        profilePhoto: "",
      },
      gottenUser: {},
      server: {
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          const fileUpload = file;
          const name = Math.floor(Math.random() * 84000) + "-" + file.name;
          const storageRef = firebase
            .storage()
            .ref(`absences/users/profile-photos/${name}`);

          const task = storageRef.put(fileUpload);

          task.on(
            "state_changed",
            (snap) => {
              progress(true, file.size, snap.bytesTransferred);
            },
            (err) => {
              load(500);
            },
            () => {
              storageRef.getDownloadURL().then((url) => {
                this.user.profilePhoto = url;
                this.imgURL = url;
                this.$http
                  .post(
                    this.API_URL + "user/setProfilePic",
                    { url },
                    {
                      headers: {
                        Authorization: "Bearer " + this.token,
                      },
                    }
                  )
                  .then((res) => {
                    if (res.body.status) {
                      this.loadUserData();
                    } else {
                      console.error("No absences for today.");
                    }
                  });
                load(200);
                setTimeout(() => {
                  this.profilePic = [];
                }, 1000);
              });
            }
          );
        },
      },
    };
  },
  computed: {},
  mounted() {},
  methods: {
    handleFilePondInit() {
      this.$refs.pond.getFiles();
    },
    loadUserData() {
      this.$http
        .get(this.API_URL + "user/getData", {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((res) => {
          if (res.body.status) {
            this.gottenUser = res.body.response;
            localStorage.setItem("profilePhoto", this.gottenUser.profilePhoto);
          } else {
            console.error("No user found.");
          }
        });
    },
    updateUser() {
      if (
        this.gottenUser.name.trim() == "" ||
        this.gottenUser.surname.trim() == "" ||
        this.gottenUser.email.trim() == ""
      ) {
        notyf.error("Todos los espacios son obligatorios.");
      } else {
        const update = {
          name: this.gottenUser.name,
          surname: this.gottenUser.surname,
          email: this.gottenUser.email,
        };
        this.$http
          .put(this.API_URL + "user/update", update, {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          })
          .then((res) => {
            if (res.body.status) {
              const user = res.body.response;
              notyf.success("Datos de perfil actualizados.");
              localStorage.setItem("name", user.name + " " + user.surname);
              localStorage.setItem("initials", user.initials);
            } else {
              console.error("No user found.");
            }
          });
      }
    },
    addUser(user) {
      if (user.password !== user.confirmPassword) {
        $("#password-failed").fadeIn(300);
      } else {
        if (
          user.name.trim() == "" ||
          user.surname.trim() == "" ||
          user.email.trim() == "" ||
          user.password.trim() == "" ||
          user.confirmPassword.trim() == ""
        ) {
          notyf.error("Todos los campos son obligatorios.");
        } else {
          this.$http
            .post(this.API_URL + "user/register", user, {
              headers: {
                Authorization: "Bearer " + this.token,
              },
            })
            .then((res) => {
              if (res.body.status) {
                this.getUsers();
                this.newUser.name = "";
                this.newUser.surname = "";
                this.newUser.email = "";
                this.newUser.password = "";
                this.newUser.confirmPassword = "";

                notyf.success("Usuario agregado correctamente");
                this.fadeOutModals();
              } else {
                if (res.body.errCode == 11000) {
                  notyf.error("Ha ocurrido un error. Este correo ya existe.");
                } else {
                  notyf.error("Ha ocurrido un error.");
                }
              }
            });
        }
      }
    },
    validatePassword(p1, p2) {
      if (p1 !== p2) {
        $("#password-failed").fadeIn(200);
      } else {
        $("#password-failed").fadeOut(200);
      }
    },
    fadeOutModals() {
      $("#modal-create-user").fadeOut(200);
    },
    showModal() {
      $("#modal-create-user").fadeIn(200);
    },
    getUsers() {
      this.$http
        .get(this.API_URL + "user/getUsers", {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((res) => {
          if (res.body.status) {
            this.users = res.body.response;
          } else {
            console.error("No users found.");
          }
        })
        .catch(() => {});
    },
    alternateStatus(e) {
      const element = e.explicitOriginalTarget;
      const id = $(element).attr("_id");

      this.$http
        .put(
          this.API_URL + "user/disableEnable/" + id,
          { foo: "Bar" },
          {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          }
        )
        .then((res) => {
          if (res.body.status) {
            this.getUsers();
          } else {
            notyf.error("No se pudo actualizar el usuario");
          }
        });
    },
    alternateRole(e) {
      const element = e.explicitOriginalTarget;
      const id = $(element).attr("_id");

      this.$http
        .put(
          this.API_URL + "user/setAdmin/" + id,
          { foo: "Bar" },
          {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          }
        )
        .then((res) => {
          if (res.body.status) {
            this.getUsers();
          } else {
            notyf.error("No se pudo actualizar el usuario");
          }
        });
    },
    changePass(data) {
      if (data.oldPassword == "" || data.newPassword == "") {
        notyf.error("Ambos campos son obligatorios.");
      } else if (data.oldPassword === data.newPassword) {
        notyf.error("Las contraseñas no pueden ser iguales.");
      } else {
        this.$http
          .put(this.API_URL + "user/changePassword", data, {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          })
          .then((res) => {
            if (res.body.status) {
              notyf.success("Contraseña actualizada.");
              this.changePassword.oldPassword = "";
              this.changePassword.newPassword = "";
            } else if (res.body.doesntMatch) {
              notyf.error(
                "Ocurrió un error. Tu contraseña actual no coincide."
              );
            } else {
              notyf.error("No se pudo actualizar la contraseña.");
            }
          });
      }
    },
    showProfile() {
      $("#users").fadeOut(100);
      $("#users-link").removeClass("active");
      $("#security").fadeOut(100);
      $("#security-link").removeClass("active");
      $("#profile-link").addClass("active");
      setTimeout(() => {
        $("#profile").fadeIn(200);
      }, 150);
    },
    showUsers() {
      $("#profile").fadeOut(100);
      $("#profile-link").removeClass("active");
      $("#security").fadeOut(100);
      $("#security-link").removeClass("active");
      setTimeout(() => {
        $("#users").fadeIn(200);
      }, 150);

      $("#users-link").addClass("active");
    },
    showSecurity() {
      $("#profile").fadeOut(100);
      $("#profile-link").removeClass("active");
      $("#users").fadeOut(100);
      $("#users-link").removeClass("active");
      setTimeout(() => {
        $("#security").fadeIn(200);
      }, 150);

      $("#security-link").addClass("active");
    },
  },
  created() {
    this.loadUserData();
    this.getUsers();
    if (!firebase.apps.length) {
      firebase.initializeApp(data.FB_CONFIG);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    firebase.analytics();
  },
};
