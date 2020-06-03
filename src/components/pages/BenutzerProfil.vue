<template>
  <v-container>
    <!-- class="mainbody" -->
    <div>
      <p class="display-1 ma-0">
        Willkommen{{ user.name() ? ' '+user.name():'' }}!
      </p><p class="overline">
        ({{ user.username }})
      </p>
    </div>
    <v-row
      align="left"
      justify="left"
      class="pageContent"
    >
      <v-col
        class="text-left pageBox"
        cols="5"
      >
        <h2> Meine Adresse: </h2>
      </v-col>

      <v-col
        class="text-left pageBox"
        cols="5"
      >
        <h2> Gesamtbetrag aller getätigten Spenden: </h2>
      </v-col>
      <v-col
        class="text-left pageBox"
        cols="5"
      >
        <v-row>
          <v-col
            class="text-left pageBox atab"
            cols="12"
          >
            <h3>Straße: {{ strasse }} {{ nummer }}</h3>
          </v-col>
          <v-col
            class="text-left pageBox"
            cols="12"
          >
            <h3>PLZ und Ort: {{ plz }} {{ ort }}</h3>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        class="text-left pageBox"
        cols="5"
      >
        <v-row>
          <v-col
            class="text-left pageBox"
            cols="12"
          >
            <h3>Gesamtbetrag: {{ betragSpenden }}€</h3>
          </v-col>
        </v-row>
      </v-col>

      <v-col
        class="text-left pageBox"
        cols="5"
      >
        <h2> Kontaktdaten:</h2>
      </v-col>
      <v-col
        class="text-left pageBox"
        cols="5"
      >
        <h2> Gesamtbetrag aller gekauften Gutscheine:</h2>
      </v-col>

      <v-col
        class="text-left pageBox"
        cols="5"
      >
        <v-row>
          <v-col
            class="text-left pageBox"
            cols="10"
          >
            <h3>E-Mail: {{ email }}</h3>
          </v-col>
          <v-col
            class="text-left pageBox"
            cols="10"
          >
            <h3>Telefon: {{ telefon }}</h3>
          </v-col>
        </v-row>
      </v-col>

      <v-col
        class="text-left pageBox"
        cols="5"
      >
        <v-row>
          <v-col
            class="text-left pageBox"
            cols="12"
          >
            <h3>Gesamtbetrag: {{ betragGutscheine }}€</h3>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <div class="linkToDonate text-center">
      <router-link
        to="/portfolio"
        tag="span"
        class="link"
      >
        <v-btn>
          <h1 style="text-align:center">
            Meine Spenden und Gutscheine
          </h1>
        </v-btn>
      </router-link>
    </div>
  </v-container>
</template>

<script>

export default {
  name: 'BenutzerProfil',

  data: () => ({
    user: window.user,
    plz: 20359,
    ort: 'Hamburg',
    betragSpenden: 300,
    betragGutscheine: 500,
    strasse: 'Reeperbahn',
    nummer: '108-114',
    email: 'johannes@web.de',
    telefon: '-',
  }),
};
</script>

<style scoped>
     .pageContent {
    height: calc(100% - 130px);
  }

  .pageHeader {
    height: 120px;
    padding-top: 10px;
    backdrop-filter: blur(15px) brightness(0.9);
  }

  .pageBox{
    position:relative;
    /* top:-10% */
  }

  .linkToDonate {
      width: 100%;
  }

   .mainbody{
        position: absolute;
        top: 0px; /* Header Height */
        bottom: 0px; /* Footer Height */
        width: 200%;
        background: url(../../assets/casedonation.jpg) no-repeat center center fixed;
        background-size: cover;
  }

</style>
