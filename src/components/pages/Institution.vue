<template>
  <div class="gradientBackground pt-4">
    <v-container class="title">
      <h1>Institution erstellen</h1>
    </v-container>
    <v-container>
      <v-row
        justify="center"
      >
        <v-col
          :cols="sizeCard"
        >
          <v-card
            elevation="5"
            shaped
            class="pt-3 pb-3"
            outlned
          >
            <v-form
              v-model="form"
            >
              <v-card-text>
                <v-row justify="center">
                  <v-col :cols="sizeField">
                    <v-text-field
                      v-model="username"
                      clearable
                      outlined
                      required
                      label="Owner Username*"
                      background-color="grey lighten-4"
                      :rules="notEmpty"
                    />
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col :cols="sizeField">
                    <v-text-field
                      v-model="publickey"
                      clearable
                      outlined
                      required
                      label="Publickey*"
                      background-color="grey lighten-4"
                      :rules="notEmpty"
                    />
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col :cols="sizeField">
                    <v-text-field
                      v-model="name"
                      clearable
                      outlined
                      required
                      label="Name*"
                      background-color="grey lighten-4"
                      :rules="notEmpty"
                    />
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col :cols="sizeField">
                    <v-textarea
                      v-model="description"
                      clearable
                      counter
                      no-resize
                      outlined
                      :rules="textRule"
                      label="Beschreibung"
                      background-color="grey lighten-4"
                      height="180"
                    />
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col :cols="sizeField">
                    <v-text-field
                      v-model="webpage"
                      clearable
                      outlined
                      :rules="websiteRule"
                      label="Website"
                      background-color="grey lighten-4"
                    />
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col :cols="sizeField">
                    <v-text-field
                      v-model="address"
                      clearable
                      outlined
                      required
                      label="Adresse*"
                      background-color="grey lighten-4"
                      :rules="notEmpty"
                    />
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col
                    :cols="sizeField"
                    class="mt-2"
                  >
                    <l-map
                      ref="map"
                      :zoom="zoom"
                      :center="center"
                      :options="mapOptions"
                      style="height: 300px; width: 100%; position:relative; z-index: 0"
                      @click="setMarkerPos"
                    >
                      <l-tile-layer
                        :url="url"
                        :attribution="attribution"
                      />
                      <l-marker
                        :lat-lng.sync="marker"
                      />
                    </l-map>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col :cols="Math.floor(sizeField/2)">
                    <v-text-field
                      v-model="coords.longitude"
                      label="Longitude*"
                      background-color="grey lighten-4"
                      required
                      :rules="numberRule"
                      @change="updateMap(null, coords.longitude)"
                    />
                  </v-col>
                  <v-col :cols="Math.floor(sizeField/2)">
                    <v-text-field
                      v-model="coords.latitude"
                      label="Latitude*"
                      background-color="grey lighten-4"
                      required
                      :rules="numberRule"
                      @change="updateMap(coords.latitude, null)"
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
                  <v-btn
                    x-large
                    class="pl-12 pr-12"
                    :disabled="!form"
                    color="success"
                    :loading="loading"
                    @click="createInstitution"
                  >
                    Institution erstellen
                  </v-btn>
                </v-row>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
      v-model="dialog.successful"
      top
      color="success"
      :timeout="10000"
    >
      Institution erstellt!
    </v-snackbar>

    <v-snackbar
      v-model="dialog.error"
      top
      color="error"
      :timeout="10000"
    >
      Institution konnte nicht erstellt werden: {{ dialog.errorMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios';
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import { userSession } from '../../userSession';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'Institution',
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data: () => ({
    loading: false,
    userSession: null,
    userData: null,
    form: false,
    username: '',
    publickey: '',
    name: '',
    description: '',
    webpage: '',
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
    numberRule: [
      (v) => !!v || 'Feld muss ausgefüllt werden',
      (v) => /^[0-9]*\.?[0-9]*$/s.test(v) || 'Bitte nur Zahlen eingeben',
    ],
    websiteRule: [
      (v) => (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/is.test(v) || v === '') || 'Bitte eine gültige URL angeben',
    ],
    dialog: {
      successful: false,
      error: false,
      errorMessage: '',
    },
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    // Set starting point to center Germany
    center: latLng(51.1642292, 10.4541194),
    marker: latLng(51.1642292, 10.4541194),
    zoom: 5,
    mapOptions: {
      zoomSnap: 0.5,
      minZoom: 1,
    },
  }),
  computed: {
    sizeCard() {
      return this.$vuetify.breakpoint.xlOnly ? 9 : 12;
    },
    sizeField() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 12;
        case 'sm': return 11;
        case 'md': return 10;
        case 'lg': return 9;
        case 'xl': return 8;
        default: return 10;
      }
    },
  },
  created() {
    this.userSession = userSession;
  },
  mounted() {
    if (userSession.isUserSignedIn()) {
      this.userData = userSession.loadUserData();
    }
    setTimeout(() => {
      this.$refs.map.mapObject.invalidateSize();
    }, 100);
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
      if (this.webpage !== '') {
        headers.webpage = this.webpage;
      }
      this.loading = true;
      axios.post('institutions', { }, { headers })
        .then(() => {
          this.dialog.successful = true;
          // window.open('./home', '_self');
        })
        .catch((err) => {
          this.dialog.errorMessage = err.toString();
          this.dialog.error = true;
        }).finally(() => {
          this.loading = false;
        });
    },
    setMarkerPos(event) {
      this.marker = event.latlng;
      this.coords.latitude = this.marker.lat;
      this.coords.longitude = this.marker.lng;
    },
    updateMap(lat, long) {
      try {
        let newCoords;
        if (lat !== null) {
          newCoords = latLng(lat, this.marker.lng);
        }
        if (long !== null) {
          newCoords = latLng(this.marker.lat, long);
        }
        this.marker = newCoords;
        this.center = newCoords;
      } catch (e) {
        // Do nothing if user input is not parseable
      }
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
