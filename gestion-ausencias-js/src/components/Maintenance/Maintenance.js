import moment from "moment";
moment.locale("es");
export default {
  name: "maintenance",
  components: {},
  props: [],
  data() {
    return {
      sd: "2021-07-04 07:00:00",
      ed: "2021-07-04 16:00:00",
      startDate: moment("2021-07-04 07:00:00").format("LLLL"),
      endDate: moment("2021-07-04 16:00:00").format("LLLL"),
      remaining: "...",
    };
  },
  computed: {},
  mounted() {},
  methods: {
    calc() {
      var a = moment(this.sd);
      var b = moment(this.ed);
      var interval = setInterval(() => {
        if (b.diff(moment(), "minutes") <= 0) {
          clearInterval(interval);
          this.remaining = " breve...";
        } else {
          this.remaining = b.fromNow(a);
        }
      }, 1000);
    },
  },
  created() {
    this.calc();
  },
};
