<template>
  <div class="gradientBackground">
    <v-container>
      <h4
        class="ma-5 display-1 text-center font-weight-medium white--text"
      >
        Deine Institutionen
      </h4>
      <v-divider class="mt-5" />

      <v-alert
        v-if="alert"
        :type="alertType"
        prominent
        dense
      >
        <v-row align="center">
          <v-col
            v-for="line in userFeedback.split('\n')"
            :key="line"
            class="grow"
          >
            {{ line }}<br>
          </v-col>
          <v-col
            class="shrink"
          >
            <v-btn
              left
              :color="alertType"
              depressed
              @click="closeAlert"
            >
              Schließen
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
      <v-layout
        v-if="loading == true"
        justify-center
      >
        <v-progress-circular
          :size="50"
          :width="7"
          color="green"
          indeterminate
          class="loadingCircle"
        />
      </v-layout>
      <div v-if="(items.length === 0 && gotResponse)">
        <v-card
          class="pa-10 ma-7"
          elevation="5"
          color="red lighten-2"
        >
          <h2>
            Es wurden keine Institutionen gefunden.
          </h2>
        </v-card>
      </div>
      <div v-else-if="gotResponse">
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.name"
            class="ma-4"
          >
            <v-card
              class="institution"
              elevation="5"
            >
              <img
                v-if="item.picturePath"
                class="elementImage"
                :src="apiurl+'/file/'+item.picturePath"
              >
              <img
                v-else
                class="elementImage"
                src="../../assets/placeholder.png"
              >
              <div
                class="companyData"
                style="border:0;"
              >
                <h2 class="ma-3 ml-4 font-weight-regular">
                  {{ item.name }}
                </h2>
                <v-card-actions
                  class="mb-0"
                >
                  <v-btn
                    class="ma-2"
                    style="color: black"
                    @click="editClick(item)"
                  >
                    Editieren
                  </v-btn>
                  <v-btn
                    class="ma-2"
                    style="color: black"
                    :href="item.webpage"
                  >
                    Website
                  </v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-dialog
          v-if="overlay"
          v-model="overlay"
          absolute
          persistent
        >
          <v-card>
            <v-card-title class="text-center">
              Institution bearbeiten
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form
                  v-model="form"
                >
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      :cols="$vuetify.breakpoint.mdAndDown ? 4 : 2"
                    >
                      <h4 class="font-weight-medium fromField">
                        Name:
                      </h4>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="editElement.name"
                        :value="editElement.name"
                        :rules="notEmpty"
                        class="inputField"
                        clearable
                        required
                      />
                    </v-col>
                  </v-row>
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      :cols="$vuetify.breakpoint.mdAndDown ? 4 : 2"
                    >
                      <h4 class="font-weight-medium fromField">
                        Bild:
                      </h4>
                    </v-col>
                    <v-col cols="3">
                      <img
                        v-if="editElement.picturePath"
                        class="elementImage"
                        :src="apiurl+'/file/'+editElement.picturePath"
                      >
                      <img
                        v-else
                        class="elementImage"
                        src="../../assets/placeholder.png"
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      class="mt-5"
                      :cols="$vuetify.breakpoint.mdAndDown ? 4 : 2"
                    />
                    <v-col cols="3">
                      <v-file-input
                        v-model="editElement.picture"
                        prepend-icon=""
                        prepend-inner-icon="mdi-camera"
                        clearable
                        label="Bild hochladen"
                        accept="image/*"
                        class=""
                      />
                    </v-col>
                  </v-row>
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      :cols="$vuetify.breakpoint.mdAndDown ? 4 : 2"
                    >
                      <h4 class="font-weight-medium fromField">
                        Website:
                      </h4>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="editElement.webpage"
                        :placeholder="editElement.webpage"
                        :rules="notEmpty"
                        class="inputField"
                        required
                      />
                    </v-col>
                  </v-row>
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      :cols="$vuetify.breakpoint.mdAndDown ? 4 : 2"
                    >
                      <h4 class="font-weight-medium fromField">
                        Beschreibung:
                      </h4>
                    </v-col>
                    <v-col>
                      <v-textarea
                        v-model="editElement.description"
                        :value="editElement.description"
                        clearable
                        counter
                        no-resize
                        outlined
                        :rules="textRule"
                        required
                        class="inputField"
                        height="120"
                        background-color="grey lighten-4"
                      />
                    </v-col>
                  </v-row>
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      :cols="$vuetify.breakpoint.mdAndDown ? 4 : 2"
                    >
                      <h4 class="font-weight-medium fromField">
                        Adresse:
                      </h4>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="editElement.address"
                        :placeholder="editElement.address"
                        :rules="notEmpty"
                        class="inputField"
                        required
                      />
                    </v-col>
                  </v-row>
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      :cols="$vuetify.breakpoint.mdAndDown ? 4 : 2"
                    >
                      <h4 class="font-weight-medium fromField">
                        Koordinaten:
                      </h4>
                    </v-col>
                    <v-col
                      class="mt-5"
                      :cols="$vuetify.breakpoint.mdAndDown ? 6 : 4"
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
                        <l-marker :lat-lng="marker" />
                      </l-map>
                    </v-col>
                  </v-row>
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      :cols="$vuetify.breakpoint.mdAndDown ? 4 : 2"
                    />
                    <v-col>
                      <v-text-field
                        v-model="editElement.longitude"
                        label="longitude"
                        :placeholder="String(editElement.longitude)"
                        :rules="notEmpty"
                        class="inputField"
                        required
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="editElement.latitude"
                        label="latitude"
                        :placeholder="String(editElement.latitude)"
                        :rules="notEmpty"
                        class="inputField"
                        required
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions
              class="ma-0 pa-0"
            >
              <v-btn-toggle
                borderless
                style="width: 50%"
              >
                <v-btn
                  color="error"
                  block
                  tile
                  @click="closeOverlay()"
                >
                  Schließen
                </v-btn>
                <v-btn
                  :disabled="!form"
                  color="success"
                  block
                  tile
                  :loading="loadingChanges"
                  @click="changeInst()"
                >
                  Bestätigen
                </v-btn>
              </v-btn-toggle>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { userSession } from '../../userSession';

export default {
  name: 'InstitutionEditieren',
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data: () => ({
    items: [],
    gotResponse: false,
    apiurl: window.apiurl,
    overlay: false,
    editElement: {
      id: null,
      authToken: null,
      name: null,
      picturePath: null,
      picture: null,
      webpage: null,
      description: null,
      address: null,
      longitude: null,
      latitude: null,
    },
    instName: null,
    alert: false,
    alertType: null,
    userFeedback: '',
    form: false,
    notEmpty: [
      (v) => !!v || 'Feld muss ausgefüllt werden',
    ],
    textRule: [
      (v) => !!v || 'Feld muss augefüllt werden',
      // eslint-disable-next-line no-control-regex
      (v) => /^([\u0000-\u00ff]*[0-9]*)*$/i.test(v) || 'Bitte nur gültige Zeichen eingeben(Latin1)',
    ],
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    center: null,
    marker: null,
    zoom: 13,
    mapOptions: {
      zoomSnap: 0.5,
    },
    err: {
      picErr: 0,
      normErr: 0,
    },
    loading: true,
    uploadingImage: false,
    loadingChanges: false,
  }),
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      axios.get(`institutions?username=${window.user.username}`)
        .then((res) => {
          this.items = res.data;
        })
        .catch((err) => {
          this.showAlert(err.toString(), 'error');
        })
        .finally(() => {
          this.gotResponse = true;
          this.resultList = this.items;
          this.loading = false;
        });
    },
    setMarkerPos(event) {
      this.marker = event.latlng;
      this.editElement.latitude = this.marker.lat;
      this.editElement.longitude = this.marker.lng;
    },
    editClick(inst) {
      if (inst !== null && inst !== undefined) {
        if (typeof inst === 'object' && Object.keys(inst).length > 0) {
          this.editElement.id = inst.id;
          this.editElement.authToken = inst.authToken;
          this.editElement.name = inst.name;
          this.editElement.picturePath = inst.picturePath;
          this.editElement.webpage = inst.webpage;
          this.editElement.description = inst.description;
          this.editElement.address = inst.address;
          this.editElement.longitude = inst.longitude;
          this.editElement.latitude = inst.latitude;
          this.instName = inst.name;

          const coords = latLng(this.editElement.latitude, this.editElement.longitude);
          this.center = coords;
          this.marker = coords;
          this.overlay = true;
          setTimeout(() => {
            this.$refs.map.mapObject.invalidateSize();
          }, 100);
          return;
        }
      }
      this.showAlert('Institution konnte nicht ausgewählt werden', 'error');
    },
    async changeInst() {
      if (userSession.isUserSignedIn()) {
        const headers = this.editElement;
        const authToken = userSession.loadUserData().authResponseToken;
        headers.authToken = authToken;

        delete headers.picturePath;
        if (headers.name === this.instName) {
          delete headers.name;
        }

        let newPic = null;
        if (this.editElement.picture) {
          newPic = this.editElement.picture;
        }
        delete this.editElement.picture;

        headers.description = window.btoa(this.editElement.description);
        this.loadingChanges = true;
        axios.patch('institutions', null, { headers })
          .catch(() => {
            this.err.normErr = 1;
          }).finally(async () => {
            if (newPic !== null) {
              this.postPic(authToken, newPic)
                .then(() => {
                  this.sentStauts();
                }).finally(() => {
                  this.loadingChanges = false;
                  this.load();
                  this.overlay = false;
                });
            } else {
              this.sentStauts();
              this.load();
              this.overlay = false;
            }
          });
      }
    },
    async postPic(authToken, pic) {
      const headers = {
        idInstitution: this.editElement.id,
        authToken,
      };
      const formData = new FormData();
      formData.append('file', pic);
      this.uploadingImage = true;
      await axios.post('file', formData, { headers })
        .catch(() => {
          this.err.picErr = 1;
        }).finally(() => {
          this.uploadingImage = false;
        });
    },
    sentStauts() {
      if (this.err.normErr === 1) {
        this.showAlert('Das Ändern war nicht erfolgreich', 'error');
      }
      if (this.err.picErr === 1) {
        this.showAlert('Das Ändern des Bilds war nicht erfolgreich', 'warning');
      }
      if (this.err.normErr === 0 && this.err.picErr === 0) {
        this.showAlert('Das Ändern war erfolgreich', 'success');
      }
    },
    closeOverlay() {
      this.overlay = false;
      this.editElement = {};
    },
    showAlert(msg, type) {
      this.alert = true;
      this.alertType = type;
      this.userFeedback = msg;
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    },
    closeAlert() {
      this.alert = false;
      this.alertType = null;
      this.userFeedback = '';
    },
  },
};
</script>

<style scoped>
  .institution {
    display: flex;
    flex-direction: row;
    margin-bottom: 25px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.8);
  }

  .elementImage{
    max-width: 200px;
    max-height: 200px;
  }

  .companyData {
    margin-left: 15px;
    flex-basis: 55%
  }

  .inputField ::placeholder{
    color: black!important;
    opacity: 1;
  }

  .fromField {
    font-size: 1.13em;
    color: black
  }

  .gradientBackground {
    background: rgb(255, 255, 255) linear-gradient(to right, rgb(199, 255, 212), rgb(176, 218, 255));
    height: 100%;
  }

  .loadingCircle {
    margin-top: 50px;
  }
</style>
