<template>
  <v-container>
    <div class="gradientBackground">
      <div class="titleHeader text-center">
        <h1
          :class="$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-3'"
          class="font-weight-thin white--text"
        >
          Neues Projekt anlegen
        </h1>
      </div>
    </div>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="project.title"
          label="Projektname"
          outlined
          clearable
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          label="Link zur Website (optional)"
          outlined
          clearable
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-overflow-btn
          label="Institution (optional)"
          target="#dropdown-example"
          auto-select-first
          outlined
          clearable
        />
      </v-col>
      <v-col>
        <router-link
          to="/institution"
          tag="span"
        >
          <v-btn
            style="text-transform: none"
          >
            neue Institution erstellen
          </v-btn>
        </router-link>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="project.goal"
          type="number"
          min="1"
          oninput="validity.valid||(value='');"
          label="Spendenziel in Szabo"
          outlined
          clearable
        />
      </v-col>
      <v-col cols="3">
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Projektende eingeben"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="date"
            min="2020-06-23"
            @input="dateMenu = false"
          />
        </v-menu>
      </v-col>
      <v-col cols="3">
        <v-menu
          v-model="timeMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="time"
              label="Uhrzeit eingeben (GMT)"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-time-picker
            v-model="time"
            format="24hr"
            @input="timeMenu = false"
          />
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-btn
        outlined
        color="black"
        @click="calcMainUntil()"
      >
        Spendenprojekt anlegen
      </v-btn>
    </v-row>
    <v-snackbar
      v-model="dialog.successful"
      bottom
      color="success"
    >
      Spendenprojekt erstellt!
    </v-snackbar>

    <v-snackbar
      v-model="dialog.error"
      bottom
      color="error"
    >
      Spendenprojekt konnte nicht erstellt werden: {{ dialog.errorMessage }}
    </v-snackbar>
    <v-snackbar
      v-model="dialog.notLoggedIn"
      top
      color="error"
    >
      Loggen Sie sich ein, um ein Spendenprojekt erstellen zu können
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import { userSession } from '../../userSession';


export default {
  name: 'ProjektAnlegen',
  data: () => ({
    dialog: {
      notLoggedIn: false,
      successful: false,
      error: false,
      errorMessage: '',
    },
    userSession: null,
    userData: null,
    error: false,
    dateMenu: false,
    timeMenu: false,
    date: '',
    time: '',
    project: {
      title: '',
      website: '',
      idInstitution: 0,
      goal: 1,
      until: 0,
      milestones: [],
    },
  }),
  created() {
    this.userSession = userSession;
  },
  mounted() {
    if (userSession.isUserSignedIn()) {
      this.userData = userSession.loadUserData();
    } else {
      this.dialog.notloggedIn = true;
    }
  },
  methods: {
    calcMainUntil() {
      if (this.date !== '' && this.time !== '') {
        this.calcUntil();
        this.createSpendenProjekt();
      }
    },
    calcUntil() {
      const dateArray = this.date.split(('-'), 3);
      const timeArray = this.time.split((':'), 2);
      this.until = Date.UTC(parseInt(dateArray[0], 10), parseInt(dateArray[1], 10), parseInt(dateArray[2], 10),
        parseInt(timeArray[0], 10), parseInt(timeArray[1], 10));
    },
    createSpendenProjekt() {
      const headers = {
        authToken: this.userData.authResponseToken,
        name: this.project.title,
        website: this.project.website,
        idInstitution: this.project.idInstitution,
        goal: this.project.goal,
        until: this.project.until,
        milestones: this.project.milestones,
      };
      axios.post('projects', {}, { headers })
        .then(() => {
          this.dialog.successful = true;
        })
        .catch((err) => {
          this.dialog.errorMessage = err.toString();
          this.dialog.error = true;
        });
    },
  },
};
</script>

<style scoped>
    .titleHeader {
        padding-bottom: 15px;
        padding-top: 10px;
        backdrop-filter: blur(15px) brightness(0.5);
    }
    .gradientBackground {
        background: linear-gradient(to right, rgb(199, 255, 212), rgb(176, 218, 255));
        background-color: rgb(255, 255, 255);
    }
</style>
