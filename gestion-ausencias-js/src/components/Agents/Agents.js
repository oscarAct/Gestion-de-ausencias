import $ from "jquery";
import "vue2-datepicker/index.css";
import TabulatorComponent from "vue-tabulator";
import "jspdf-autotable";
import moment from "moment";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
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
  ],
});

export default {
  name: "agents",
  components: { AwesomeLocalTable: TabulatorComponent },
  props: [],
  data() {
    return {
      fecha: null,
      API_URL: data.BASE_API_URL,
      searchValue: "",
      today: "",
      user: {
        id_number: "",
        name: "",
        lastName: "",
        userId: "",
      },
      token: localStorage.getItem("token"),
      userTU: {
        _id: "",
        id_number: "",
        name: "",
        lastName: "",
        userId: "",
      },
      mensajeError: "",
      users: [],
      agents: [],
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
          { formatter: "rownum", hozAlign: "center", width: 40 },
          {
            formatter: "responsiveCollapse",
            width: 30,
            minWidth: 30,
            hozAlign: "left",
            resizable: false,
            headerSort: false,
          },
          {
            title: "User",
            field: "userId",
            hozAlign: "left",
            width: 90,
            sorter: "number",
            responsive: 0,
          },
          {
            title: "_id",
            field: "_id",
            hozAlign: "left",
            width: 200,
            sorter: "number",
            responsive: 0,
            visible: false,
          },
          {
            title: "Cedula",
            field: "id_number",
            hozAlign: "left",
            sorter: "number",
          },
          {
            title: "Nombre",
            field: "name",
            responsive: 2,
            hozAlign: "left",
            sorter: "string",
          },

          {
            title: "Apellidos",
            field: "lastName",
            hozAlign: "left",
            sorter: "string",
          },
          {
            title: "Estado",
            field: "active",
            hozAlign: "left",
            responsive: 2,
            formatter: this.formatState,
            cellClick: (e, cell) => {
              const tabulator = this.$refs.tabulator.getInstance();
              const id = cell.getRow().getData()._id;
              let page = tabulator.getPage();
              this.toggleState(id, page);
            },
          },
          {
            title: "Creado el",
            field: "createdAt",
            hozAlign: "left",
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
            cellClick: (e, cell) => {
              const data = cell.getRow().getData();
              this.showFormUpdate(data);
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
              const data = cell.getRow().getData()._id;
              localStorage.setItem("itl", data);
              $("#eliminar-agente").toggleClass("hidden");
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
      tabulator.download("csv", "lista_de_agentes.csv", { separator: "," });
    },
    downloadXlsx() {
      const tabulator = this.$refs.tabulator.getInstance();
      tabulator.download("xlsx", "lista_de_agentes.xlsx", {
        sheetName: "Reporte ausencias",
      });
    },
    downloadPdf() {
      const tabulator = this.$refs.tabulator.getInstance();
      tabulator.download("pdf", "lista_de_agentes.pdf");
    },
    search(data) {
      const tabulator = this.$refs.tabulator.getInstance();
      let field = $("#country").val();
      tabulator.setFilter(field, "like", data);
    },
    clearFilters() {
      const tabulator = this.$refs.tabulator.getInstance();
      tabulator.clearFilter();
      tabulator.clearHeaderFilter();
      this.searchValue = "";
    },
    toggleState(id, page) {
      this.$http
        .put(
          this.API_URL + "agent/deactivate/" + id,
          { foo: "bar" },
          {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          }
        )
        .then((res) => {
          if (res.body.status) {
            const indiceElemento = this.agents.findIndex((el) => el._id == id);
            let newData = [...this.agents];
            newData[indiceElemento] = {
              ...newData[indiceElemento],
              active: res.body.updatedField.active,
            };
            this.agents = newData;
            const tabulator = this.$refs.tabulator.getInstance();
            setTimeout(() => {
              tabulator.setPage(page);
            }, 0);
          } else {
            console.error("Fallo al actualizar estado de agente");
          }
        });
    },
    getDate() {
      this.today = moment()
        .locale("es-us")
        .format("LL");
    },
    showFormModal() {
      $("#form-ausencia").toggleClass("hidden");
    },
    showFormUpdate(data) {
      $("#form-update-user").toggleClass("hidden");
      this.userTU._id = data._id;
      this.userTU.id_number = data.id_number;
      this.userTU.name = data.name;
      this.userTU.lastName = data.lastName;
      this.userTU.userId = data.userId;
    },
    closeFormUpdate() {
      $("#form-update-user").toggleClass("hidden");
    },
    closeDeleteConfirm() {
      localStorage.removeItem("itl");
      $("#eliminar-agente").toggleClass("hidden");
    },
    closeFormModal() {
      $("#form-ausencia").toggleClass("fadeOut");

      $("#eliminar-ausencia").toggleClass("fadeOut");
      setTimeout(() => {
        $("#form-ausencia").addClass("hidden");
        $("#form-ausencia").removeClass("fadeOut");

        $("#eliminar-ausencia").addClass("hidden");
        $("#eliminar-ausencia").removeClass("fadeOut");
      }, 500);
    },
    formatDate(cell) {
      try {
        const date = cell._cell.value;
        return moment(date)
          .locale("es-us")
          .format("LL");
      } catch (error) {}
    },
    formatState(cell) {
      let template;
      try {
        const value = cell._cell.value;
        if (value) {
          template = `<span
          class="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-green-800 bg-green-100 rounded-full"
          >Activo</span
        >`;
        } else {
          template = `<span
          class="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-yellow-800 bg-yellow-100 rounded-full"
          >Inactivo</span
        >`;
        }
      } catch (error) {
        return;
      }

      return template;
    },
    changeQuantity() {
      this.options.paginationSize = $("#cantidad-registros").val();
    },
    getName(id_number) {
      if (id_number.length > 8) {
        $(".linear-progress-material").toggleClass("hidden");
        this.$http
          .get("https://apis.gometa.org/cedulas/" + id_number)
          .then((res) => {
            $(".linear-progress-material").toggleClass("hidden");
            let firstname = res.body.results[0].firstname.toString();
            let lastname = res.body.results[0].lastname.toString();

            let splitName = firstname.split(" ");
            let splitLast = lastname.split(" ");

            let finalName = "";
            let finalLast = "";

            for (let index = 0; index < splitName.length; index++) {
              const element = splitName[index];
              finalName += this.camelize(element) + " ";
              if (index == splitName.length - 1) {
                this.user.name = finalName.trim();
              }
            }
            for (let index = 0; index < splitLast.length; index++) {
              const element = splitLast[index];
              finalLast += this.camelize(element) + " ";
              if (index == splitLast.length - 1) {
                this.user.lastName = finalLast.trim();
              }
            }
          });
      } else {
      }
    },
    saveAgent(user) {
      $(".linear-progress-material").toggleClass("hidden");
      if (
        user.id_number.trim() == "" ||
        user.name.trim() == "" ||
        user.userId.trim() == "" ||
        user.lastName.trim() == ""
      ) {
        this.mensajeError = "Favor completar todos los campos.";
        $(".empty-inputs").removeClass("hidden");
      } else {
        $(".empty-inputs").addClass("hidden");
        this.$http
          .post(this.API_URL + "agent/save", user, {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          })
          .then((res) => {
            $(".linear-progress-material").toggleClass("hidden");
            if (res.body.status) {
              this.closeFormModal();
              this.loadAgents();
              this.user.name = "";
              this.user.id_number = "";
              this.user.lastName = "";
              this.user.userId = "";
              notyf.success("Registro correcto.");
            } else {
              this.mensajeError =
                "Ha ocurrido un error a la hora de registrar el usuario. Reintentalo";
              $(".empty-inputs").removeClass("hidden");
            }
          });
      }
    },
    updateAgent(user) {
      $(".linear-progress-material").toggleClass("hidden");
      if (
        user.id_number.trim() == "" ||
        user.name.trim() == "" ||
        user.userId.trim() == "" ||
        user.lastName.trim() == ""
      ) {
        $(".linear-progress-material").toggleClass("hidden");
        this.mensajeError = "Favor completar todos los campos.";
        $(".empty-inputs").removeClass("hidden");
      } else {
        $(".empty-inputs").addClass("hidden");
        this.$http
          .put(this.API_URL + "agent/update/" + user._id, user, {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          })
          .then((res) => {
            $(".linear-progress-material").toggleClass("hidden");
            if (res.body.status) {
              this.closeFormUpdate();
              this.loadAgents();
              this.userTU.name = "";
              this.userTU.id_number = "";
              this.userTU.lastName = "";
              this.userTU.userId = "";
              notyf.success("Agente actualizado.");
            } else {
              this.mensajeError =
                "Ha ocurrido un error a la hora de registrar el usuario. Reintentalo";
              $(".empty-inputs").removeClass("hidden");
            }
          });
      }
    },
    deleteAgent() {
      this.$http
        .put(
          this.API_URL + "agent/delete/" + localStorage.getItem("itl"),
          { foo: "bar" },
          {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.body.status) {
            this.loadAgents();
            this._idToDelete = "";
            this.closeDeleteConfirm();
            notyf.success("Agente eliminado.");
            localStorage.removeItem("itl");
          } else {
            this._idToDelete = "";
            this.closeDeleteConfirm();
            notyf.error("Ha ocurrido un error. Prueba reintentando.");
            localStorage.removeItem("itl");
          }
        });
    },
    camelize(str) {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return index === 0 ? word.toUpperCase() : word.toLowerCase();
        })
        .replace(/\s+/g, "");
    },
    loadAgents() {
      this.$http
        .get(this.API_URL + "agent/getAll", {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((res) => (this.agents = res.body.response));
    },
  },
  created() {
    this.loadAgents();
    this.getDate();
  },
};
