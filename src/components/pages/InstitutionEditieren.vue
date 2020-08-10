<template>
  <Default title="Deine Institutionen">
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
      v-if="loading"
      justify-center
    >
      <v-progress-circular
        :size="50"
        :width="7"
        color="green"
        indeterminate
        class="mt-24"
      />
    </v-layout>
    <div v-if="(items.length === 0 && gotResponse)">
      <v-card
        class="pa-10 ma-7"
        elevation="5"
        color="red lighten-4"
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
          cols="12"
          md="6"
          lg="4"
          xl="3"
        >
          <MyCard :img-src="item.picturePath ? (apiurl+'/file/'+item.picturePath) : null">
            <template #title>
              {{ item.name }}
            </template>
            <template #text>
              {{ item.short }}
            </template>
            <template #actions>
              <v-btn
                color="rgba(0, 0, 0, 0.54)"
                text
                width="40%"
                @click="editClick(item)"
              >
                Editieren
              </v-btn>
              <v-btn
                color="rgba(0, 0, 0, 0.54)"
                text
                width="40%"
                :to="'/institutionVoucher/'+item.id"
              >
                Gutscheine
              </v-btn>
              <v-spacer />
              <v-btn
                icon
                :href="item.webpage"
              >
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>
            </template>
          </MyCard>
        </v-col>
      </v-row>
    </div>

    <MyDialog v-model="overlay">
      <template #title>
        Institution bearbeiten
      </template>

      <template #text>
        <v-container>
          <v-form
            v-model="form"
          >
            <MyFormRow title="Name">
              <v-text-field
                v-model="editElement.name"
                :value="editElement.name"
                :rules="notEmpty"
                clearable
                required
              />
            </MyFormRow>

            <MyFormRow title="Bild">
              <v-img
                class="white--text grey lighten-2 mx-auto"
                :src="previewImage ? previewImage : (editElement.picturePath ? (apiurl+'/file/'+editElement.picturePath) : require(`@/assets/placeholder.png`))"
                height="300px"
                aspect-ratio="1"
                contain
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey darken-5"
                    />
                  </v-row>
                </template>
              </v-img>
            </MyFormRow>

            <MyFormRow title="">
              <v-file-input
                v-model="editElement.picture"
                prepend-icon=""
                prepend-inner-icon="mdi-camera"
                clearable
                label="Bild hochladen"
                accept="image/*"
                @change="previewImageUpdate()"
              />
            </MyFormRow>

            <MyFormRow title="Website">
              <v-text-field
                v-model="editElement.webpage"
                :placeholder="editElement.webpage"
                :rules="websiteRule"
                required
              />
            </MyFormRow>

            <MyFormRow title="Kurz-Beschreibung">
              <v-text-field
                v-model="editElement.short"
                counter
                maxlength="140"
                clearable
                :rules="textRule"
              />
            </MyFormRow>

            <MyFormRow title="Beschreibung">
              <Editor
                ref="toastuiEditor"
                :initial-value="editElement.description"
                :options="editorOptions"
                height="500px"
                initial-edit-type="wysiwyg"
              />
            </MyFormRow>

            <MyFormRow title="Addresse">
              <v-text-field
                v-model="editElement.address"
                :placeholder="editElement.address"
                :rules="notEmpty"
                required
              />
            </MyFormRow>

            <MyFormRow title="Koordinaten">
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
            </MyFormRow>

            <v-row>
              <v-col
                class="mt-5"
                cols="12"
                sm="3"
              />
              <v-col>
                <v-text-field
                  v-model="editElement.longitude"
                  label="longitude"
                  :placeholder="String(editElement.longitude)"
                  type="number"
                  :rules="coordRules"
                  @change="updateMap(null, editElement.longitude)"
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="editElement.latitude"
                  label="latitude"
                  :placeholder="String(editElement.latitude)"
                  type="number"
                  :rules="coordRules"
                  @change="updateMap(editElement.latitude, null)"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </template>

      <template #actions>
        <v-row class="mx-0">
          <v-col>
            <v-btn
              color="error"
              block
              @click="closeOverlay()"
            >
              Schließen
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              block
              :disabled="!form"
              color="success"
              :loading="loadingChanges"
              @click="changeInst()"
            >
              Bestätigen
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </MyDialog>
  </Default>
</template>

<script>
import axios from 'axios';
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { userSession } from '@/userSession';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import EventBus from '@/utils/eventBus';

import MyDialog from '../MyDialog.vue';
import MyFormRow from '../MyFormRow.vue';
import Default from '../Default.vue';
import MyCard from '../MyCard.vue';

export default {
  name: 'InstitutionEditieren',
  components: {
    MyCard,
    Default,
    MyDialog,
    MyFormRow,
    LMap,
    LTileLayer,
    LMarker,
    Editor,
  },
  data: () => ({
    editorOptions: {
      usageStatistics: false,
      language: 'de-DE',
    },
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
    websiteRule: [
      (v) => (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/is.test(v) || (v === '' || v === null)) || 'Bitte eine gültige URL angeben',
    ],
    coordRules: [
      (v) => /^-?[0-9]*\.?[0-9]*$/s.test(v) || 'Bitte nur Zahlen eingeben',
    ],
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    center: null,
    marker: null,
    zoom: 13,
    mapOptions: {
      zoomSnap: 0.5,
      minZoom: 1,
    },
    err: {
      picErr: 0,
      normErr: 0,
    },
    loading: true,
    uploadingImage: false,
    loadingChanges: false,
    previewImage: false,
  }),
  mounted() {
    this.load();
  },
  methods: {
    previewImageUpdate() {
      if (this.previewImage) {
        URL.revokeObjectURL(this.previewImage);
      }
      this.previewImage = URL.createObjectURL(this.editElement.picture);
    },
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
    updateMap(lat, long) {
      try {
        let newCoords = this.marker;
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
          this.editElement.short = inst.short;

          this.instName = inst.name;

          let coords = latLng(this.editElement.latitude, this.editElement.longitude);
          if (coords === null) {
            // Set MAP to center Germany
            coords = latLng(51.1642292, 10.4541194);
            if (this.editElement.latitude === null) {
              this.editElement.latitude = '';
            }
            if (this.editElement.longitude === null) {
              this.editElement.longitude = '';
            }
          }
          this.center = coords;
          this.marker = coords;
          this.overlay = true;
          setTimeout(() => {
            this.$refs.map.mapObject.invalidateSize();
            this.$refs.map.setZoom(this.zoom);
          }, 100);
          this.$nextTick(() => {
            this.$refs.toastuiEditor.invoke('reset');
            this.$refs.toastuiEditor.invoke('setMarkdown', this.editElement.description);
          });
          return;
        }
      }
      this.showAlert('Institution konnte nicht ausgewählt werden', 'error');
    },
    async changeInst() {
      this.editElement.description = this.$refs.toastuiEditor.invoke('getMarkdown');
      if (!/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/is.test(this.editElement.description)) {
        EventBus.$emit('new-snackbar', 'Die Beschrebung darf nur gültige (Latin1) Zeichen enthalten',
          'warning', 4000, true);
        return;
      }

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
        headers.short = window.btoa(this.editElement.short);
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
              this.loadingChanges = false;
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
</style>
