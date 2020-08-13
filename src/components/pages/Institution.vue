<template>
  <Default title="Institution erstellen">
    <v-row
      justify="center"
    >
      <v-col>
        <MyCard>
          <template #title />
          <template #subtitle>
            <p class="text-center">
              Mit * markierte Felder müssen ausgefüllt werden
            </p>
          </template>
          <template #text>
            <v-form
              v-model="form"
            >
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
                  <v-text-field
                    v-model="short"
                    clearable
                    counter
                    no-resize
                    outlined
                    :rules="textRule"
                    label="Kurz-Beschreibung"
                    background-color="grey lighten-4"
                    maxlength="140"
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
                      :continuous-world="false"
                      :no-wrap="true"
                    />
                    <l-marker
                      :lat-lng.sync="marker"
                    />
                  </l-map>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col :cols="$vuetify.breakpoint.smAndUp ? Math.floor(sizeField/2) : 12">
                  <v-text-field
                    v-model="coords.longitude"
                    label="Longitude*"
                    background-color="grey lighten-4"
                    required
                    outlined
                    type="number"
                    :rules="longRule"
                    @change="updateMap(null, coords.longitude)"
                  />
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndUp ? Math.floor(sizeField/2) : 12">
                  <v-text-field
                    v-model="coords.latitude"
                    label="Latitude*"
                    background-color="grey lighten-4"
                    required
                    outlined
                    type="number"
                    :rules="latRule"
                    @change="updateMap(coords.latitude, null)"
                  />
                </v-col>
              </v-row>
            </v-form>
          </template>
          <template #actions>
            <v-btn
              :disabled="!form"
              color="success"
              width="100%"
              :loading="loading"
              @click="createInstitution"
            >
              Institution erstellen
            </v-btn>
          </template>
        </MyCard>
      </v-col>
    </v-row>
  </Default>
</template>

<script>
import axios from 'axios';
import { latLng, latLngBounds } from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import { userSession } from '@/userSession';
import 'leaflet/dist/leaflet.css';
import validator from 'validator';
import EventBus from '@/utils/eventBus';
import Default from '../Default.vue';
import MyCard from '../MyCard.vue';

export default {
  name: 'Institution',
  components: {
    Default,
    MyCard,
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
    short: '',
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
    longRule: [
      (v) => !!v || 'Feld muss ausgefüllt werden',
      (v) => (parseFloat(v) >= -180 && parseFloat(v) <= 180) || 'Bitte nur Werte im Bereich -180° bis 180° angeben',
      (v) => /^-?[0-9]*\.?[0-9]*$/s.test(v) || 'Bitte nur Zahlen eingeben',
    ],
    latRule: [
      (v) => !!v || 'Feld muss ausgefüllt werden',
      (v) => (parseFloat(v) >= -90 && parseFloat(v) <= 90) || 'Bitte nur Werte im Bereich -90° bis 90° angeben',
      (v) => /^-?[0-9]*\.?[0-9]*$/s.test(v) || 'Bitte nur Zahlen eingeben',
    ],
    websiteRule: [
      (v) => (!v || validator.isURL(v || '', { protocols: ['http', 'https'], require_protocol: true })) || 'Bitte eine gültige URL angeben',
    ],
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    // Set starting point to center Germany
    center: latLng(51.1642292, 10.4541194),
    marker: latLng(51.1642292, 10.4541194),
    zoom: 5,
    bounds: latLngBounds(latLng(-90, -180), latLng(90, 180)),
    mapOptions: {
      zoomSnap: 0.5,
      minZoom: 1,
    },
  }),
  computed: {
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
      this.$refs.map.mapObject.setMaxBounds(this.bounds);
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
      if (this.short !== '') {
        headers.short = window.btoa(this.short);
      }
      if (this.webpage !== '') {
        headers.webpage = this.webpage;
      }
      this.loading = true;
      axios.post('institutions', { }, { headers })
        .then(() => {
          EventBus.$emit('new-snackbar', 'Institution erstellt!', 'success', 10000, true);
          // window.open('./home', '_self');
        })
        .catch((err) => {
          if (err.response) {
            EventBus.$emit('new-snackbar', `Institution konnte nicht erstellt werden: ${err.toString()} (${err.response.data.error})`, 'error', 10000, true);
          } else {
            EventBus.$emit('new-snackbar', `Institution konnte nicht erstellt werden: ${err.toString()}`, 'error', 10000, true);
          }
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
        if (lat !== null && lat <= 90 && lat >= -90) {
          newCoords = latLng(lat, this.marker.lng);
        }
        if (long !== null && long <= 180 && long >= -180) {
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
</style>
