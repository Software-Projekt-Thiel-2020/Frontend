<template>
  <v-app>
    <Navbar/>
    <v-content>
      <Home/>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from './components/elements/Navbar';
import Home from './components/pages/Home';

export default {
  name: 'App',

  components: {
    Navbar,
    Home
  },

  data: () => ({
    //
  }),
};
</script>
