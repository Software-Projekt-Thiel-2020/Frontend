import Vue from 'vue';
import VueCurrencyInput from 'vue-currency-input';
import VueRouter from 'vue-router';
import axios from 'axios';
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
import Registrieren from './components/pages/Registrieren.vue';
import Institution from './components/pages/Institution.vue';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

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
  { path: '/register', component: Registrieren },
  { path: '/institution', component: Institution },
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
