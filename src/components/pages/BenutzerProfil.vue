<template>
  <div class="ma-5">
    <v-container>
      <div>
        <h1 class="display-2 ma-0">
          Willkommen!
        </h1><p class="display-2 overline">
          ({{ user.username }})
        </p>
      </div>
      <v-row>
        <v-col
          sm="9"
          class="text-left pageBox"
        >
          <h2>Profildaten:</h2>
          <br>

          <v-row
            no-gutters
            class="entry"
          >
            <v-col>
              <h4>Username:</h4>
            </v-col>
            <v-col>
              <h4>{{ username }}</h4>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <h4>Vorname:</h4>
            </v-col>
            <v-col>
              <h4>{{ firstname }}</h4>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <h4>Nachname:</h4>
            </v-col>
            <v-col>
              <h4>{{ lastname }}</h4>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <h4>E-Mail:</h4>
            </v-col>
            <v-col>
              <h4>{{ email }}</h4>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

export default {
  name: 'BenutzerProfil',

  data: () => ({
    user: window.user,
    username: 'testusername',
    firstname: 'Vornamen',
    lastname: 'Nachname',
    email: 'Test@test.de',
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
