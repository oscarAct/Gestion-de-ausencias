//Libreries

import $ from "jquery";
import { html2canvas } from "html2canvas";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/es";

import TabulatorComponent from "vue-tabulator";
import "jspdf-autotable";
import moment from "moment";
import { vSelect } from "@desislavsd/vue-select";
import vueFilePond from "vue-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import firebase from "firebase";
import { Notyf } from "notyf";
import data from "../enviroments/development.config";

//css dependencies

import "vue2-datepicker/index.css";
import "@desislavsd/vue-select/dist/vue-select.css";
import "filepond/dist/filepond.css";
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
      absecensByReason: [],
      weeklyAbsences: [],
      chart1Data: [],
      charging: 0,
      chartOptions: {
        plotOptions: {
          colors: ["#0000FF", "#0066FF", "#00CCFF"],
          series: {
            pointWidth: 15,
            pointPadding: 0,
            dataLabels: {
              enabled: true,
              formatter: function() {
                if (this.y > 0) {
                  return this.y;
                }
              },
            },
          },
          bar: {
            borderWidth: 0,
            pointPadding: 0,
          },
        },
      },
      daysToCloud: false,
      chartOptions2: {
        plotOptions: {
          colors: ["#0000FF", "#0066FF", "#00CCFF"],
          series: {
            pointWidth: 200,
            pointPadding: 0,
            dataLabels: {
              enabled: true,
              formatter: function() {
                if (this.y > 0) {
                  return this.y;
                }
              },
            },
          },
          bar: {
            borderWidth: 0,
            pointPadding: 0,
          },
        },
      },
      qty: 5,
      month: moment().format("M"),
      output: null,
      daylyPercent: 0,
      todayAbsences: "",
      token: "Bearer " + localStorage.getItem("token"),
      fecha: null,
      API_URL: data.BASE_API_URL,
      weeklyStatsUrl: data.BASE_API_URL + "reporting/lastWeekAbsences",
      imgViewerURL: "",
      mostAbsencedAgents: [],
      newAbsence: {
        agent: "",
        reason: "",
        description: "",
        from: "",
        until: "",
        proof: "",
        proofName: "",
      },
      diff: 0,
      searchValue: "",
      imgURL: "",
      agents: [],
      reasons: [],
      server: {
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          const fileUpload = file;
          const name = Math.floor(Math.random() * 84000) + "-" + file.name;
          this.newAbsence.proofName = name;
          const storageRef = firebase
            .storage()
            .ref(`absences/absences-photos/${name}`);

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
                this.newAbsence.proof = url;
                load(200);
              });
            }
          );
        },
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
        movableColumns: true,
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
            hozAlign: "center",
            resizable: false,
            headerSort: false,
          },
          {
            title: "_id",
            field: "_id",
            hozAlign: "left",
            sorter: "number",
            responsive: 1,
            visible: false,
          },
          {
            title: "UserID",
            field: "agent.userId",
            hozAlign: "left",
            sorter: "string",
            responsive: 1,
            width: 90,
          },
          {
            title: "Nombre",
            field: "agent.name",
            responsive: 1,
          },
          {
            title: "Apellidos",
            field: "agent.lastName",
            responsive: 1,
          },
          {
            title: "Motivo",
            field: "reason.name",
            hozAlign: "left",
            sorter: "String",
          },
          {
            title: "Cuando",
            field: "when",
            sorter: "string",
            mutator: (value, data, type, params, component) => {
              var today = moment().format("yyyy-MM-DD");
              var from = moment(data.from)
                .add(1, "days")
                .format("yyyy-MM-DD");
              var until = moment(data.until)
                .add(1, "days")
                .format("yyyy-MM-DD");

              if (moment(today).isBetween(from, until, undefined, "[]")) {
                return "Hoy";
              } else {
                return moment(from).calendar(null, {
                  lastDay: "[Ayer]",
                  sameDay: "[Hoy]",
                  nextDay: "[Mañana]",
                  lastWeek: "[El pasado] dddd DD",
                  nextWeek: "[El próximo] dddd DD",
                  sameElse: "L",
                });
              }
            },
            hozAlign: "left",
            sorter: "number",
          },
          {
            title: "Area de trabajo",
            field: "agent.area.name",
            hozAlign: "left",
            sorter: "String",
          },
          { title: "Descripcion", field: "description", responsive: 2 },
          {
            title: "Comprobante",
            field: "proof",
            responsive: 2,
            width: 100,
            formatter: this.formatPhoto,
            cellClick: function(e, cell) {
              const data = cell.getRow().getData();
              if (data.proof != "") {
                $(".img-viewer").fadeToggle(200);
                $("#proof").attr("src", data.proof);
              } else {
                return;
              }
            },
          },
          {
            title: "Fecha inicio",
            mutator: (value, data, type, params, component) => {
              const date = moment(data.from)
                .locale("es-mx")
                //In production the date shows one day less. This line avoid that to happens
                .add(1, "days")
                .format("DD/MM/yyyy");

              return date;
            },
            field: "fromDate",
            hozAlign: "left",
          },
          {
            title: "Fecha fin",
            field: "untilDate",
            mutator: (value, data, type, params, component) => {
              const date = moment(data.until)
                .locale("es-mx")
                //In production the date shows one day less. This line avoid that to happens
                .add(1, "days")
                .format("DD/MM/yyyy");

              return date;
            },
            hozAlign: "left",
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
              localStorage.setItem("del-absence", cell.getRow().getData()._id);
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
    async print() {
      const el = this.$refs.chart2;
      const options = {
        type: "dataURL",
      };
      this.output = await this.$html2canvas(el, options);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.download =
        "Indice de ausencias " +
        moment()
          .format("DD-MM-yyyy-hhmmss")
          .toString();
      a.href = this.output;
      a.click();
    },
    async print2() {
      const el = this.$refs.chart1;
      const options = {
        type: "dataURL",
      };
      this.output = await this.$html2canvas(el, options);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.download =
        "Ausencias de hoy " +
        moment()
          .format("DD-MM-yyyy-hhmmss")
          .toString();
      a.href = this.output;
      a.click();
    },
    setDate() {
      this.newAbsence.from = moment(this.fecha[0]).format("MM/DD/yyyy");
      this.newAbsence.until = moment(this.fecha[1]).format("MM/DD/yyyy");

      var a = moment(this.fecha[0]).format("MM/DD/yyyy");
      var b = moment(this.fecha[1]).format("MM/DD/yyyy");

      var c = moment(b).diff(a, "days") + 1;
      if (Number.isNaN(c)) {
        this.diff = 0;
        this.daysToCloud = false;
      } else {
        this.diff = c;
        if (this.diff > 15) {
          this.daysToCloud = true;
        } else {
          this.daysToCloud = false;
        }
      }
    },
    formatPhoto(cell) {
      try {
        const value = cell._cell.value;
        if (value == "") {
          return "Sin comprobante";
        } else {
          return `<img src="${value}" width="30px" alt="imagen no carga" />`;
        }
      } catch (error) {}
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
    addFile() {
      $("#img-alert").fadeIn(300);
    },
    removeFile() {
      $("#img-alert").fadeOut(300);
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
    closeViewer() {
      $(".img-viewer").fadeToggle(200);
    },
    downloadCsv() {
      const tabulator = this.$refs.tabulator.getInstance();
      tabulator.download("csv", "reporte_de_ausencias.csv", { separator: "," });
    },
    downloadXlsx() {
      const tabulator = this.$refs.tabulator.getInstance();
      tabulator.download("xlsx", "reporte_de_ausencias.xlsx", {
        sheetName: "Reporte ausencias",
        from: "mm/dd/yyyy;@",
        cellDates: true,
        raw: true,
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
      try {
        const date = cell._cell.value;
        return (
          moment(date)
            .locale("es-mx")
            //In production the date shows one day less. This line avoid that to happens
            .add(1, "days")
            .format("LL")
        );
      } catch (error) {}
    },
    changeQuantity() {
      this.options.paginationSize = $("#cantidad-registros").val();
    },
    deleteAbsence() {
      const id = localStorage.getItem("del-absence");
      this.$http
        .put(
          this.API_URL + "absence/delete/" + id,
          { foo: "bar" },
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        .then((res) => {
          if (res.body.status) {
            this.loadAbsences();
            this.closeModals();
            this.loadTodayAbsences();
            notyf.success("Registro eliminado correctamente.");
            localStorage.removeItem("del-absence");
          } else {
            notyf.error("Ha ocurrido un error al procesar la solicitud.");
          }
        });
    },
    loadAbsences() {
      this.$http
        .get(this.API_URL + "absence/getAll", {
          headers: {
            Authorization: this.token,
          },
        })
        .then((res) => {
          this.absences = res.body.response;
          this.charging = this.charging + 1;
        });
    },
    loadMostAbsencedAgents(qty, month) {
      this.$http
        .get(this.API_URL + "reporting/recurrentAgents/" + qty + "/" + month, {
          headers: {
            Authorization: this.token,
          },
        })
        .then((res) => {
          this.mostAbsencedAgents = res.body;
          console.log(res.body);
          this.charging = this.charging + 1;
        });
    },
    setId(e) {
      try {
        this.newAbsence.agent = e.index;
      } catch (error) {}
    },
    hideImgViewer() {},
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
      localStorage.removeItem("del-absence");
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
          .post(this.API_URL + "absence/save", data, {
            headers: {
              Authorization: this.token,
            },
          })
          .then((res) => {
            $(".linear-progress-material").toggleClass("hidden");
            if (res.body.status) {
              this.closeFormModal();
              this.loadTodayAbsences();
              this.loadAbsences();
              this.clearForm();
              this.weeklyAbsences = [];
              this.loadWeekAnalytic();
              notyf.success("Ausencia registrada con exito.");
            } else {
              notyf.error("El registro no tuvo éxito. Reintenta.");
            }
          });
      }
    },
    loadAgents() {
      this.$http
        .get(this.API_URL + "agent/getAllActive", {
          headers: {
            Authorization: this.token,
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
          this.charging = this.charging + 1;
        });
    },
    loadReasons() {
      this.$http
        .get(this.API_URL + "reason/getAll", {
          headers: {
            Authorization: this.token,
          },
        })
        .then((res) => {
          if (res.body.status) {
            this.reasons = res.body.response;
          } else {
            console.error("No reasons was found.");
          }
          this.charging = this.charging + 1;
        });
    },
    loadTodayAbsences() {
      this.$http
        .get(this.API_URL + "absence/getTodayAbsences", {
          headers: {
            Authorization: this.token,
          },
        })
        .then((res) => {
          if (res.body.status) {
            this.todayAbsences = res.body.response;
            const data = res.body.data;
          } else {
            console.error("No absences for today.");
          }
          this.charging = this.charging + 1;
        });
    },
    loadTodayAnalyticAbsence() {
      this.$http
        .get(this.API_URL + "reporting/absecensByReason", {
          headers: {
            Authorization: this.token,
          },
        })
        .then((res) => {
          this.absecensByReason = res.body;
          const data = res.body;
          for (let i = 0; i < data.length; i++) {
            const el = data[i];
            const name = el._id.name;
            const obj = [name, el.count];
            this.chart1Data.push(obj);
          }
          this.charging = this.charging + 1;
        });
      /*
              {
                name: "Vacaciones",
                data: { Vacaciones: 1 },
              },
            */
    },
    loadTop(qty, month) {
      console.log(month);
      this.loadMostAbsencedAgents(qty, month);
    },
    loadWeekAnalytic() {
      this.$http
        .get(this.API_URL + "reporting/lastWeekAbsences", {
          headers: {
            Authorization: this.token,
          },
        })
        .then((res) => {
          //this.weeklyAbsences = res.body;
          const data = res.body;
          for (let i = 0; i < data.length; i++) {
            const el = data[i];
            const fecha = moment(el.name).add(1, "days");
            const obj = {
              name: moment(fecha).calendar(null, {
                lastDay: "[Ayer]",
                sameDay: "[Hoy]",
                nextDay: "[Mañana]",
                lastWeek: "[El] dddd DD",
                nextWeek: "dddd",
                sameElse: "L",
              }),
              data: el.data,
            };
            this.weeklyAbsences.push(obj);
          }
          this.charging = this.charging + 1;
        });
      /*
              {
                name: "Vacaciones",
                data: { Vacaciones: 1 },
              },
            */
    },
    dateFormatter(value) {
      moment.locale("es-mx");
      return (
        moment(value)
          //In production the date shows one day less. This line avoid that to happens
          .add(1, "days")
          .format("L")
      );
    },
    loaderBg() {
      console.log(this.charging);
      let percent = (this.charging * 100) / 7;
      console.log(percent + "%");
      if (this.charging < 7) {
        //this.loaderBg();
        console.log(percent + "%");
      } else {
        return;
      }
    },
  },
  created() {
    document.title = "Gestion de ausencias - Inicio";

    this.loadTodayAnalyticAbsence();
    this.loadWeekAnalytic();
    this.loadTodayAbsences();
    this.loadAbsences();
    this.getDate();
    this.loadAgents();
    this.loadReasons();
    this.loadMostAbsencedAgents(this.qty, this.month);
    this.loaderBg();
    if (!firebase.apps.length) {
      firebase.initializeApp(data.FB_CONFIG);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    firebase.analytics();
  },
};
