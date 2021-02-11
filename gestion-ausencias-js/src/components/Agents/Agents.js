import $ from "jquery";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import TabulatorComponent from "vue-tabulator";
import XLSX from "xlsx/dist/xlsx.full.min.js";
import jsPDF from "jspdf/dist/jspdf.es.min.js";
import "jspdf-autotable";
import moment from "moment";

export default {
  name: "agents",
  components: { AwesomeLocalTable: TabulatorComponent },
  props: [],
  data() {
    return {
      fecha: null,
      searchValue: "",
      today: "",
      users: [],
      dados: [],
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
            title: "User",
            field: "userId",
            align: "center",
            cssClass: "text-center",
            width: 200,
            sorter: "number",
            responsive: 0,
          },
          {
            title: "Cedula",
            field: "id_number",
            align: "center",
            sorter: "number",
          },
          {
            title: "Nombre",
            field: "name",
            responsive: 2,
            align: "center",
            sorter: "string",
          },

          {
            title: "Apellidos",
            field: "lastName",
            align: "center",
            sorter: "string",
          },
          {
            title: "Estado",
            field: "active",
            align: "center",
            responsive: 2,
            formatter: this.formatState,
          },
          {
            title: "Creado el",
            field: "createdAt",
            align: "center",
            formatter: this.formatDate,
            sorter: "date",
          },
          {
            title: "",
            width: 60,
            responsive: 0,
            download: false,
            sortable: false,
            formatter: this.openEditIcon,
            cellClick: function(e, cell) {
              console.log(cell.getRow().getData());
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
            click: function(e, cell, value, data) {
              console.log(data);
            },
          },
        ],
      },
    };
  },
  computed: {},
  mounted() {},
  methods: {
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
      console.log(fecha2);
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
      console.log(data);
      let field = $("#country").val();
      console.log(field);
      tabulator.setFilter(field, "like", data);
    },
    getDate() {
      this.today = moment()
        .locale("es-us")
        .format("LL");

      console.log(
        moment("2021-02-10T22:48:18.242Z")
          .locale("es-us")
          .format("L")
      );
    },
    formatDate(date) {
      return moment(date)
        .locale("es-us")
        .format("L");
    },
    formatState(cell) {
      let template;
      const value = cell._cell.value;
      if (value) {
        template = `<span
          class="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-green-800 bg-green-100 rounded-full"
          >Activo</span
        >`;
      } else {
        template = `<span
          class="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-800 bg-red-100 rounded-full"
          >Inactivo</span
        >`;
      }
      return template;
    },
    changeQuantity() {
      this.options.paginationSize = $("#cantidad-registros").val();
    },
  },
  created() {
    this.$http
      .get("http://localhost:3000/api/agent/getAll", {
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYwMjQ0YTkwMDVkMWQwMmQxMDZiOTUzZSIsInVzZXIiOnsiZGVsZXRlZCI6ZmFsc2UsIl9pZCI6IjYwMjQ0YTkwMDVkMWQwMmQxMDZiOTUzZSIsIm5hbWUiOiJPc2NhciIsInN1cm5hbWUiOiJNb3JhbGVzIiwiZW1haWwiOiJvc2NhcjIyOTYxNUBob3RtYWlsLmNvbSIsImluaXRpYWxzIjoiT00iLCJwcm9maWxlUGhvdG8iOiIiLCJjcmVhdGVkQXQiOiIyMDIxLTAyLTEwVDIxOjA1OjIwLjYzOVoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAyLTEwVDIxOjA1OjIwLjYzOVoifSwiaWF0IjoxNjEyOTk2MzMxfQ.coQBlWJvsGZYqk8vnjWIgNs7yMphHvg-NlwF5Cj-nwA",
        },
      })
      .then((res) => (this.dados = res.body.response));
    this.getDate();
  },
};
