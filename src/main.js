import Vue from 'vue';
import VueCurrencyInput from 'vue-currency-input';
import VueRouter from 'vue-router';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import Home from './components/pages/Home.vue';
import AGB from './components/pages/AGB.vue';
import Datenschutz from './components/pages/Datenschutz.vue';
import Impressum from './components/pages/Impressum.vue';
import Portfolio from './components/pages/Portfolio.vue';
import Gutscheine from './components/pages/Gutscheine.vue';
import Spenden from './components/pages/Spenden.vue';
import UeberUns from './components/pages/UeberUns.vue';
import WarumSpenden from './components/pages/WarumSpenden.vue';
import BenutzerProfil from './components/pages/BenutzerProfil.vue';
import Project from './components/pages/Project.vue';
import ProjektAnlegen from './components/pages/ProjektAnlegen.vue';
import Institution from './components/pages/Institution.vue';
import ProjectGutschein from './components/pages/ProjectGutschein.vue';
import InstitutionEditieren from './components/pages/InstitutionEditieren.vue';

// eslint-disable-next-line no-underscore-dangle
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  // eslint-disable-next-line global-require
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  // eslint-disable-next-line global-require
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  // eslint-disable-next-line global-require
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
window.apiurl = process.env.VUE_APP_BASE_URL;

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueCurrencyInput);

window.blockstack = require('blockstack');

const routes = [
  { path: '/', component: Home },
  { path: '/agb', component: AGB },
  { path: '/datenschutz', component: Datenschutz },
  { path: '/impressum', component: Impressum },
  { path: '/portfolio', component: Portfolio },
  { path: '/gutscheine', component: Gutscheine },
  { path: '/spenden', component: Spenden },
  { path: '/project/:id', component: Project },
  { path: '/ueberuns', component: UeberUns },
  { path: '/warumspenden', component: WarumSpenden },
  { path: '/profil', component: BenutzerProfil },
  { path: '/projektanlegen', component: ProjektAnlegen },
  { path: '/institution', component: Institution },
  { path: '/projectGutschein/:id', component: ProjectGutschein },
  { path: '/InstitutionEditieren/', component: InstitutionEditieren },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
  scrollBehavior() { // immer auf den Seitenanfang springen
    return { x: 0, y: 0 };
  },
});

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app');
