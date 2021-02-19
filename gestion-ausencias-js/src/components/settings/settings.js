import vueFilePond from "vue-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";

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

export default {
  name: "settings",
  components: { FilePond },
  props: [],
  data() {
    return {
      profilePic: [],
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
  },
  created() {
    this.loadUserData();
    firebase.initializeApp(data.FB_CONFIG);
    firebase.analytics();
  },
};
