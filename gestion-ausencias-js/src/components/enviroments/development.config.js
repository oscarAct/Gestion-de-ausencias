import moment from "moment";
//Calculate time for showing meesage
let show;
const AdviceEndDate = moment("2021-07-30 00:00:00");
AdviceEndDate.diff(moment(), "minutes") <= 0 ? show = false : show = true;

// exporting data
const data = {
  //BASE_API_URL: "http://localhost:3000/api/",
  BASE_API_URL: "https://api-gestion-ausencias-r8jmv.ondigitalocean.app/api/",
  FB_CONFIG: {
    apiKey: "AIzaSyAhltvhQkduoenbTMoEwLRaQwQGPee_aJk",
    authDomain: "gestor-de-archivos-34c41.firebaseapp.com",
    projectId: "gestor-de-archivos-34c41",
    storageBucket: "gestor-de-archivos-34c41.appspot.com",
    messagingSenderId: "1053688780427",
    appId: "1:1053688780427:web:cef8490eff6889ba2ca68e",
    measurementId: "G-XJ5Z68RGW6",
  },
  MAINTENANCE: false,
  NOTICE: show,
};
export default data;
