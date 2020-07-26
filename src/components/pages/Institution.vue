<template>
  <div class="gradientBackground pt-4">
    <v-container class="title">
      <h1>Institution erstellen</h1>
    </v-container>
    <v-container>
      <v-card
        elevation="5"
        shaped
        class="pt-3"
        outlned
      >
        <v-form
          v-model="form"
        >
          <v-card-text>
            <v-row justify="center">
              <v-col cols="6">
                <v-text-field
                  v-model="username"
                  clearable
                  outlined
                  required
                  label="Owner Username*"
                  :rules="notEmpty"
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="6">
                <v-text-field
                  v-model="publickey"
                  clearable
                  outlined
                  required
                  label="Publickey*"
                  :rules="notEmpty"
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="6">
                <v-text-field
                  v-model="name"
                  clearable
                  outlined
                  required
                  label="Name*"
                  :rules="notEmpty"
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="6">
                <v-file-input
                  v-model="picture"
                  clearable
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera"
                  label="Bild hochladen"
                  accept="image/*"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="6">
                <v-textarea
                  v-model="description"
                  clearable
                  counter
                  no-resize
                  outlined
                  :rules="textRule"
                  label="Beschreibung"
                  height="180"
                  background-color="grey lighten-4"
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="6">
                <v-text-field
                  v-model="website"
                  clearable
                  outlined
                  label="Website"
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="6">
                <v-text-field
                  v-model="address"
                  clearable
                  outlined
                  required
                  label="Adresse*"
                  :rules="notEmpty"
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col
                cols="7"
                class="mt-2"
              >
                <!-- TODO: LEAFLET MAP -->
                <h1 style="height: 300px; width: 100%; position:relative; z-index: 0; background-color: #1ae14f">
                  Leaflet Map
                </h1>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="3">
                <v-text-field
                  v-model="coords.longitude"
                  label="Longitude*"
                  required
                  rules="notEmpty"
                  placeholder=""
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="coords.latitude"
                  label="Latitude*"
                  required
                  rules="notEmpty"
                />
              </v-col>
            </v-row>
            <p class="text-center font-weight-light">
              Mit * markierte Felder müssen ausgefüllt werden
            </p>
          </v-card-text>
          <v-card-actions>
            <v-row
              class="pb-3"
              justify="center"
            >
              <v-col cols="4">
                <v-btn
                  :disabled="!form"
                  type="submit"
                  block
                  @click="createInstitution"
                >
                  Institution erstellen
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-container>
    <v-snackbar
      v-model="dialog.successful"
      top
      color="success"
    >
      Institution erstellt!
    </v-snackbar>

    <v-snackbar
      v-model="dialog.error"
      top
      color="error"
    >
      Institution konnte nicht erstellt werden: {{ dialog.errorMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios';
import { userSession } from '../../userSession';

export default {
  name: 'Institution',
  data: () => ({
    userSession: null,
    userData: null,
    form: false,
    username: '',
    publickey: '',
    name: '',
    picture: null,
    description: '',
    website: '',
    address: '',
    coords: {
      latitude: '',
      longitude: '',
    },
    textRule: [
      // eslint-disable-next-line no-control-regex
      (v) => /^([\u0000-\u00ff]*[0-9]*)*$/i.test(v) || 'Bitte nur gültige Zeichen eingeben(Latin1)',
    ],
    notEmpty: [
      (v) => !!v || 'Feld muss ausgefüllt werden',
    ],
    err: {
      picErr: 0,
      normErr: 0,
    },
    dialog: {
      successful: false,
      error: false,
      errorMessage: '',
    },
  }),
  created() {
    this.userSession = userSession;
  },
  mounted() {
    if (userSession.isUserSignedIn()) {
      this.userData = userSession.loadUserData();
    }
  },
  methods: {
    createInstitution() {
      const headers = {
        authToken: this.userData.authResponseToken,
        username: this.username,
        publickey: this.publickey,
        name: this.name,
        address: this.address,
        longitude: this.coords.longitude,
        latitude: this.coords.latitude,
      };
      if (this.description !== '') {
        headers.description = window.btoa(this.description);
      }
      if (this.website !== '') {
        headers.website = this.website;
      }
      axios.post('institutions', { }, { headers })
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
  .title {
    text-align:center;
  }

  .gradientBackground {
    background: rgb(255, 255, 255) linear-gradient(to right, rgb(220, 255, 232), rgb(196, 240, 255));
    height: 100%;
  }
</style>
