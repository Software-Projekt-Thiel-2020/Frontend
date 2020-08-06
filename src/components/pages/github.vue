<template>
  <v-container>
    <h1>Zeit, seit letzdem commit</h1>
    <br>
    <br>
    <h1>Backend</h1>
    <h2>{{ backend_data ? parseDate(backend_data[0].commit.committer.date) : '?' }} Tagen</h2>
    <h4>{{ backend_data ? backend_data[0].commit.committer.date : '?' }}</h4>

    <br>

    <h1>Frontend</h1>
    <h2>{{ frontend_data ? parseDate(frontend_data[0].commit.committer.date) : '?' }} Tagen</h2>
    <h4>{{ frontend_data ? frontend_data[0].commit.committer.date : '?' }}</h4>

    <div v-if="error">
      Error getting data
    </div>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Github',
  data: () => ({
    backend_data: null,
    frontend_data: null,
    error: false,
  }),
  mounted() {
    axios.get('https://api.github.com/repos/Software-Projekt-Thiel-2020/Backend/commits')
      .then((res) => {
        this.backend_data = res.data;
      })
      .catch((err) => {
        this.error = err.toString();
      });
    axios.get('https://api.github.com/repos/Software-Projekt-Thiel-2020/Frontend/commits')
      .then((res) => {
        this.frontend_data = res.data;
      })
      .catch((err) => {
        this.error = err.toString();
      });
  },
  methods: {
    parseDate(d) {
      return (Date.now() - (new Date(d))) / 1000 / 60 / 60 / 24;
    },
  },
};
</script>

<style scoped>

</style>
