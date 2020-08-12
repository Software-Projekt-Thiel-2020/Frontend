<template>
  <v-app>
    <Navbar />
    <ContentManager />
    <v-content>
      <router-view />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import ContentManager from './components/elements/ContentManager.vue';
import Navbar from './components/elements/Navbar.vue';
import Footer from './components/elements/Footer.vue';

export default {
  name: 'App',

  components: {
    ContentManager,
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
