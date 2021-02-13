//Libreries

import $ from "jquery";
import DatePicker from "vue2-datepicker";
import TabulatorComponent from "vue-tabulator";
import "jspdf-autotable";
import moment from "moment";
import { vSelect } from "@desislavsd/vue-select";
import vueFilePond from "vue-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import firebase from "firebase";
import { Notyf } from "notyf";

//css dependencies

import "vue2-datepicker/index.css";
import "@desislavsd/vue-select/dist/vue-select.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "notyf/notyf.min.css";

// js dependencies

import XLSX from "xlsx/dist/xlsx.full.min.js";
import jsPDF from "jspdf/dist/jspdf.es.min.js";

// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);
// Create an instance of Notyf
const notyf = new Notyf({
  duration: 4000,
  position: {
    x: "center",
    y: "top",
  },
  types: [
    {
      type: "success",
      background: "#18bc9c",
    },
  ],
});

window.jsPDF = jsPDF;
window.XLSX = XLSX;
export default {
  name: "Home",
  components: {
    DatePicker,
    AwesomeLocalTable: TabulatorComponent,
    vSelect,
    FilePond,
  },
  props: [],
  data() {
    return {
      myFiles: [],
      fecha: null,
      newAbsence: {
        agent: "",
        reason: "",
        description: "",
        from: "",
        until: "",
        proof: "",
      },
      searchValue: "",
      imgURL: "",
      agents: [],
      reasons: [],
      server: {
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          const fileUpload = file;
          const name = Math.floor(Math.random() * 84000) + "-" + file.name;
          const storageRef = firebase
            .storage()
            .ref(`absences/absences-photos/${name}`);

          const task = storageRef.put(fileUpload);

          task.on(
            "state_changed",
            (snap) => {
              let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
              progress(true, file.size, snap.bytesTransferred);
            },
            (err) => {
              load(500);
            },
            () => {
              storageRef.getDownloadURL().then((url) => {
                this.newAbsence.proof = url;
                load(200);
              });
            }
          );
        },
      },
      newAbsence: {
        agent: "",
        reason: "",
        description: "",
        from: "",
        until: "",
      },
      selected: "",
      today: "",
      users: [],
      absences: [],
      dados: [
        {
          name: "Teste",
          age: 13,
        },
      ],
      options: {
        pagination: "local",
        editor: false,
        paginationSize: 15,
        resizableColumns: true,
        placeholder: "No se encontraron registros.",
        responsiveLayout: "collapse",
        layout: "fitColumns",
        downloadConfig: {
          columnGroups: false, //include column groups in column headers for download
          rowGroups: false, //do not include row groups in download
          columnCalcs: false, //do not include column calculation rows in download
        },
        columns: [
          {
            formatter: "responsiveCollapse",
            width: 30,
            minWidth: 30,
            align: "center",
            resizable: false,
            headerSort: false,
          },
          {
            title: "Nombre",
            field: "agent.name",
            width: 200,
            responsive: 0,
          },
          {
            title: "Apellidos",
            field: "agent.lastName",
            width: 200,
            responsive: 0,
          },
          {
            title: "Motivo",
            field: "reason.name",
            align: "left",
            sorter: "number",
          },
          { title: "Descripcion", field: "description", responsive: 2 },
          {
            title: "Fecha inicio",
            formatter: this.formatDate,
            field: "from",
            align: "left",
            sorter: "date",
          },
          {
            title: "Fecha fin",
            field: "until",
            formatter: this.formatDate,
            align: "left",
          },
          {
            title: "",
            width: 60,
            responsive: 0,
            download: false,
            sortable: false,
            formatter: this.openEditIcon,
            cellClick: function(e, cell) {
              const data = cell.getRow().getData();
            },
            editable: false,
          },
          {
            title: "",
            width: 60,
            responsive: 0,
            sortable: false,
            download: false,
            formatter: this.openDeleteIcon,
            cellClick: function(e, cell) {
              $("#eliminar-ausencia").toggleClass("hidden");

              //cell.getRow().delete();
            },
            editable: false,
          },
        ],
      },
    };
  },
  computed: {},
  mounted() {},
  methods: {
    setDate() {
      this.newAbsence.from = moment(this.fecha[0]).format("MM/DD/yyyy");
      this.newAbsence.until = moment(this.fecha[1]).format("MM/DD/yyyy");
    },
    openEditIcon(value, data, cell, row, options) {
      let element = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" class="w-5 h-5 text-blue-400 mx-auto hover:text-blue-500 ml-5 editRow" v-on:click="showMessage" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>`;
      return `
      <div class="col-span-1">
      ${element}
      </div>
      `;
    },
    openDeleteIcon(value, data, cell, row, options) {
      let element = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" class="w-5 h-5 text-red-400 hover:text-red-500 mx-auto" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>`;
      return `
      <div class="col-span-1">
      ${element}
      </div>
      `;
    },
    showDate(fecha) {
      let fechaNueva = new Date(fecha[0]);
      let fecha2 =
        fechaNueva.getDate() +
        "/" +
        (fechaNueva.getMonth() + 1) +
        "/" +
        fechaNueva.getFullYear();
    },
    handleFilePondInit() {
      const pond = this.$refs.pond;
      pond.getFiles();
    },
    downloadCsv() {
      const tabulator = this.$refs.tabulator.getInstance();
      tabulator.download("csv", "reporte_de_ausencias.csv", { separator: "," });
    },
    downloadXlsx() {
      const tabulator = this.$refs.tabulator.getInstance();
      tabulator.download("xlsx", "reporte_de_ausencias.xlsx", {
        sheetName: "Reporte ausencias",
      });
    },
    downloadPdf() {
      const tabulator = this.$refs.tabulator.getInstance();
      tabulator.download("pdf", "reporte_de_ausencias.pdf");
    },
    search(data) {
      const tabulator = this.$refs.tabulator.getInstance();
      let field = $("#country").val();
      tabulator.setFilter(field, "like", data);
    },
    getDate() {
      this.today = moment()
        .locale("es-us")
        .format("LL");
    },
    formatDate(cell) {
      const date = cell._cell.value;
      return moment(date)
        .locale("es-us")
        .format("LL");
    },
    changeQuantity() {
      this.options.paginationSize = $("#cantidad-registros").val();
    },
    loadAbsences() {
      this.$http
        .get("http://localhost:3000/api/absence/getAll", {
          headers: {
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYwMjQ0YTkwMDVkMWQwMmQxMDZiOTUzZSIsInVzZXIiOnsiZGVsZXRlZCI6ZmFsc2UsIl9pZCI6IjYwMjQ0YTkwMDVkMWQwMmQxMDZiOTUzZSIsIm5hbWUiOiJPc2NhciIsInN1cm5hbWUiOiJNb3JhbGVzIiwiZW1haWwiOiJvc2NhcjIyOTYxNUBob3RtYWlsLmNvbSIsImluaXRpYWxzIjoiT00iLCJwcm9maWxlUGhvdG8iOiIiLCJjcmVhdGVkQXQiOiIyMDIxLTAyLTEwVDIxOjA1OjIwLjYzOVoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAyLTEwVDIxOjA1OjIwLjYzOVoifSwiaWF0IjoxNjEyOTk2MzMxfQ.coQBlWJvsGZYqk8vnjWIgNs7yMphHvg-NlwF5Cj-nwA",
          },
        })
        .then((res) => {
          this.absences = res.body.response;
        });
    },
    setId(e, f) {
      this.newAbsence.agent = e.index;
    },
    showFormModal() {
      $("#form-ausencia").toggleClass("hidden");
    },
    closeFormModal() {
      $("#form-ausencia").toggleClass("hidden");
    },
    ShowExportOptions() {
      $("#download-menu").fadeToggle(0);
      $("#backdrop-bg").fadeToggle(0);
    },
    closeExportOptions() {
      if (!$(event.target).closest("#download-menu").length) {
        $("#download-menu").fadeOut(0);
        $("#backdrop-bg").fadeOut(0);
      }
    },
    closeModals() {
      $("#form-ausencia").toggleClass("fadeOut");

      $("#eliminar-ausencia").toggleClass("fadeOut");
      setTimeout(() => {
        $("#form-ausencia").addClass("hidden");
        $("#form-ausencia").removeClass("fadeOut");

        $("#eliminar-ausencia").addClass("hidden");
        $("#eliminar-ausencia").removeClass("fadeOut");
      }, 500);
    },
    clearForm() {
      this.newAbsence.agent = "";
      this.newAbsence.reason = "";
      this.newAbsence.from = "";
      this.newAbsence.until = "";
      this.newAbsence.description = "";
      this.newAbsence.proof = "";

      this.fecha = [];
      this.myFiles = [];
    },
    saveAbsence(data) {
      if (
        data.agent == "" ||
        data.agent == undefined ||
        data.reason == "" ||
        data.reason == undefined ||
        data.from == "" ||
        data.from == undefined ||
        data.until == "" ||
        data.until == undefined
      ) {
        notyf.error("Por favor llene todos los campos requeridos.");
      } else {
        $(".linear-progress-material").toggleClass("hidden");
        this.$http
          .post("http://localhost:3000/api/absence/save", data, {
            headers: {
              Authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYwMjQ0YTkwMDVkMWQwMmQxMDZiOTUzZSIsInVzZXIiOnsiZGVsZXRlZCI6ZmFsc2UsIl9pZCI6IjYwMjQ0YTkwMDVkMWQwMmQxMDZiOTUzZSIsIm5hbWUiOiJPc2NhciIsInN1cm5hbWUiOiJNb3JhbGVzIiwiZW1haWwiOiJvc2NhcjIyOTYxNUBob3RtYWlsLmNvbSIsImluaXRpYWxzIjoiT00iLCJwcm9maWxlUGhvdG8iOiIiLCJjcmVhdGVkQXQiOiIyMDIxLTAyLTEwVDIxOjA1OjIwLjYzOVoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAyLTEwVDIxOjA1OjIwLjYzOVoifSwiaWF0IjoxNjEyOTk2MzMxfQ.coQBlWJvsGZYqk8vnjWIgNs7yMphHvg-NlwF5Cj-nwA",
            },
          })
          .then((res) => {
            $(".linear-progress-material").toggleClass("hidden");
            if (res.body.status) {
              this.closeFormModal();
              this.loadAbsences();
              this.clearForm();
              notyf.success("Ausencia registrada con exito.");
            } else {
              notyf.error("El registro no tuvo éxito. Reintenta.");
            }
          });
      }
    },
    loadAgents() {
      this.$http
        .get("http://localhost:3000/api/agent/getAllActive", {
          headers: {
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYwMjQ0YTkwMDVkMWQwMmQxMDZiOTUzZSIsInVzZXIiOnsiZGVsZXRlZCI6ZmFsc2UsIl9pZCI6IjYwMjQ0YTkwMDVkMWQwMmQxMDZiOTUzZSIsIm5hbWUiOiJPc2NhciIsInN1cm5hbWUiOiJNb3JhbGVzIiwiZW1haWwiOiJvc2NhcjIyOTYxNUBob3RtYWlsLmNvbSIsImluaXRpYWxzIjoiT00iLCJwcm9maWxlUGhvdG8iOiIiLCJjcmVhdGVkQXQiOiIyMDIxLTAyLTEwVDIxOjA1OjIwLjYzOVoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAyLTEwVDIxOjA1OjIwLjYzOVoifSwiaWF0IjoxNjEyOTk2MzMxfQ.coQBlWJvsGZYqk8vnjWIgNs7yMphHvg-NlwF5Cj-nwA",
          },
        })
        .then((res) => {
          if (res.body.status) {
            let data = res.body.response;
            let array = [];
            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              let obj = {
                name: element.name + " " + element.lastName.trim(),
                id: element._id.toString(),
              };
              array.push(obj);
            }
            this.agents = array;
          } else {
          }
        });
    },
    loadReasons() {
      this.$http
        .get("http://localhost:3000/api/reason/getAll", {
          headers: {
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYwMjQ0YTkwMDVkMWQwMmQxMDZiOTUzZSIsInVzZXIiOnsiZGVsZXRlZCI6ZmFsc2UsIl9pZCI6IjYwMjQ0YTkwMDVkMWQwMmQxMDZiOTUzZSIsIm5hbWUiOiJPc2NhciIsInN1cm5hbWUiOiJNb3JhbGVzIiwiZW1haWwiOiJvc2NhcjIyOTYxNUBob3RtYWlsLmNvbSIsImluaXRpYWxzIjoiT00iLCJwcm9maWxlUGhvdG8iOiIiLCJjcmVhdGVkQXQiOiIyMDIxLTAyLTEwVDIxOjA1OjIwLjYzOVoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAyLTEwVDIxOjA1OjIwLjYzOVoifSwiaWF0IjoxNjEyOTk2MzMxfQ.coQBlWJvsGZYqk8vnjWIgNs7yMphHvg-NlwF5Cj-nwA",
          },
        })
        .then((res) => {
          if (res.body.status) {
            this.reasons = res.body.response;
          } else {
            console.error("No reasons was found.");
          }
        });
    },
  },
  created() {
    this.loadAbsences();
    this.getDate();
    this.loadAgents();
    this.loadReasons();
    var firebaseConfig = {
      apiKey: "AIzaSyAhltvhQkduoenbTMoEwLRaQwQGPee_aJk",
      authDomain: "gestor-de-archivos-34c41.firebaseapp.com",
      projectId: "gestor-de-archivos-34c41",
      storageBucket: "gestor-de-archivos-34c41.appspot.com",
      messagingSenderId: "1053688780427",
      appId: "1:1053688780427:web:cef8490eff6889ba2ca68e",
      measurementId: "G-XJ5Z68RGW6",
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  },
};
