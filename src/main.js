import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueCurrencyInput from 'vue-currency-input'
import VueRouter from 'vue-router';
import Home from './components/pages/Home';
import AGB from './components/pages/AGB';
import Datenschutz from "./components/pages/Datenschutz";
import Impressum from "./components/pages/Impressum";
import Portfolio from "./components/pages/Portfolio";
import Gutscheine from "./components/pages/Gutscheine";
import Spenden from "./components/pages/Spenden";
import UeberUns from "./components/pages/UeberUns";
import WarumSpenden from "./components/pages/WarumSpenden";
import BenutzerProfil from "./components/pages/BenutzerProfil";
import Project from "./components/pages/Project";

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(VueCurrencyInput);

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
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
