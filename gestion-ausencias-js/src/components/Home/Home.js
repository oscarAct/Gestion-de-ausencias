import $ from "jquery";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import TabulatorComponent from "vue-tabulator";
import XLSX from "xlsx/dist/xlsx.full.min.js";
import jsPDF from "jspdf/dist/jspdf.es.min.js";
import "jspdf-autotable";
import moment from "moment";

window.jsPDF = jsPDF;
window.XLSX = XLSX;
export default {
  name: "Home",
  components: { DatePicker, AwesomeLocalTable: TabulatorComponent },
  props: [],
  data() {
    return {
      fecha: null,
      searchValue: "",
      today: "",
      users: [],
      dados: [
        {
          name: "Teste",
          age: 13,
        },
      ],
      options: {
        pagination: "local",
        editor: false,
        paginationSize: 10,
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
          { title: "Nombre", field: "name", width: 200, responsive: 0 },
          {
            title: "Motivo",
            field: "company.name",
            align: "left",
            sorter: "number",
          },
          { title: "Descripcion", field: "address.suite", responsive: 2 },
          {
            title: "Fecha inicio",
            field: "company.name",
            align: "left",
            sorter: "date",
          },
          { title: "Fecha fin", field: "address.zipcode", align: "left" },
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
    },
    changeQuantity() {
      this.options.paginationSize = $("#cantidad-registros").val();
    },
  },
  created() {
    this.$http
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => (this.dados = res.body));
    this.getDate();
  },
};

$(document).ready(function() {
  $("#agregar-ausencia").on("click", () => {
    $("#form-ausencia").toggleClass("hidden");
  });
  $(".backdrop-close").on("click", () => {
    $("#form-ausencia").toggleClass("fadeOut");

    $("#eliminar-ausencia").toggleClass("fadeOut");
    setTimeout(() => {
      $("#form-ausencia").addClass("hidden");
      $("#form-ausencia").removeClass("fadeOut");

      $("#eliminar-ausencia").addClass("hidden");
      $("#eliminar-ausencia").removeClass("fadeOut");
    }, 500);
  });
  $("#options-menu").on("click", () => {
    $("#download-menu").fadeToggle(0);
    $("#backdrop-bg").fadeToggle(0);
  });
  $("#backdrop-bg").on("click", function(event) {
    if (!$(event.target).closest("#download-menu").length) {
      $("#download-menu").fadeOut(0);
      $("#backdrop-bg").fadeOut(0);
    }
  });

  // $(".editRow").on("click", () => {
  //   console.log("Hola");
  // });
});
