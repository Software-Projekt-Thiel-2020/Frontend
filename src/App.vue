<template>
  <v-app>
    <Navbar/>
    <v-content>
      <router-view></router-view>
    </v-content>
    <Footer/>
  </v-app>
</template>

<script>
import Navbar from './components/elements/Navbar';
import Footer from "./components/elements/Footer";

export default {
  name: 'App',

  components: {
    Footer,
    Navbar,
  },

  data: () => ({
    //
  }),
};
</script>
<style>
  Navbar {
    position: relative;
    z-index: 10;
  }
  Footer{
    position: relative;
    z-index: 0;
  }
  v-content {

    overflow: scroll;
  }
</style>