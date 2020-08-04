<template>
  <div class="gradientBackground">
    <v-container>
      <h4
        class="ma-5 display-1 text-center font-weight-medium white--text"
      >
        Deine Projekte
      </h4>
      <router-link
        v-if="!$vuetify.breakpoint.smAndDown"
        to="/projektanlegen"
        tag="span"
        class="newProject"
      >
        <v-btn
          class="mt-5"
          style="color: black"
          color="success"
        >
          Projekt anlegen
        </v-btn>
      </router-link>
      <v-layout
        v-else
        justify-center
      >
        <router-link
          to="/projektanlegen"
          tag="span"
        >
          <v-btn
            class="mt-5"
            style="color: black"
            color="success"
          >
            Projekt anlegen
          </v-btn>
        </router-link>
      </v-layout>
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
      <div v-else-if="(gotResponse && userProjects.length === 0)">
        <v-card
          class="pa-10 ma-7"
          elevation="5"
          color="red lighten-4"
        >
          <h2>
            Es wurden keine Projekte gefunden.
          </h2>
        </v-card>
      </div>
      <div v-else-if="gotResponse">
        <v-row>
          <v-col
            v-for="item in userProjects"
            :key="item.id"
            class="ma-4"
          >
            <v-card
              class="institution"
              elevation="5"
            >
              <img
                class="elementImage"
                :src="item.picturePath ? apiurl+'/file/'+item.picturePath : '../../assets/placeholder.png'"
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
                    @click="editClick(item.id)"
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
          :fullscreen="smallScreen"
          absolute
          persistent
        >
          <v-card>
            <v-card-title class="text-center overflow-hidden">
              Projekt {{ editElement.name }} bearbeiten
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
                        Bild:
                      </h4>
                    </v-col>
                    <v-col cols="3">
                      <img
                        class="elementImage"
                        :src="editElement.picturePath ? apiurl+'/file/'+editElement.picturePath : '../../assets/placeholder.png'"
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
                        :rules="websiteRule"
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
                        Koordinaten:
                      </h4>
                    </v-col>
                    <v-col
                      class="mt-5"
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
                        type="number"
                        :rules="coordRules"
                        class="inputField"
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
                        class="inputField"
                        @change="updateMap(editElement.latitude, null)"
                      />
                    </v-col>
                  </v-row>
                  <v-row gutters>
                    <v-col cols="12">
                      <p class="mr-1">
                        Es können nur Meilensteine mit höherem Ziel hinzugefügt werden!
                      </p>
                      <v-data-table
                        :headers="tableHeaders"
                        :items="allMilestones"
                        sort-by="until"
                        class="elevation-2"
                      >
                        <template v-slot:top>
                          <v-toolbar flat>
                            <v-toolbar-title>Meilensteine</v-toolbar-title>
                            <v-spacer />
                            <v-btn
                              color="primary"
                              dark
                              @click="milestoneDialog = true"
                            >
                              <v-icon
                                v-if="$vuetify.breakpoint.xsOnly"
                              >
                                mdi-plus-thick
                              </v-icon>
                              <span
                                v-else
                              >
                                Meilenstein hinzufügen
                              </span>
                            </v-btn>
                            <v-dialog
                              v-model="milestoneDialog"
                              max-width="400"
                            >
                              <v-card>
                                <v-card-title>
                                  <span class="headline"> Neuer Meilenstein</span>
                                </v-card-title>
                                <v-card-text>
                                  <v-row justify="center">
                                    <v-col>
                                      <v-text-field
                                        v-model="newMile.milestoneName"
                                        label="Meilensteinname"
                                        outlined
                                        clearable
                                      />
                                    </v-col>
                                  </v-row>
                                  <v-row justify="center">
                                    <v-col>
                                      <v-text-field
                                        v-model="newMile.goal"
                                        label="Spendenziel in Wei"
                                        min="1"
                                        outlined
                                        clearable
                                        :rules="weiRule"
                                      />
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col align="center">
                                      <v-date-picker
                                        v-model="newMile.until"
                                        :min="today"
                                        :max="editElement.until"
                                      />
                                    </v-col>
                                  </v-row>
                                </v-card-text>
                                <v-card-actions>
                                  <v-spacer />
                                  <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="closeDialog"
                                  >
                                    Cancel
                                  </v-btn>
                                  <v-btn
                                    :disabled="newMile.milestoneName === '' || newMile.goal === '' || newMile.until === null"
                                    color="blue darken-1"
                                    text
                                    @click="saveMilestone"
                                  >
                                    Save
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                          </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{ item }">
                          <div
                            v-if="isNewMilestone(item)"
                          >
                            <!-- Zunächst nicht implementiert
                            <v-icon
                              small
                              @click="editMilestone(item)"
                            >
                              mdi-pencil
                            </v-icon>
                            -->
                            <v-icon
                              small
                              @click="deleteMilestone(item)"
                            >
                              mdi-delete
                            </v-icon>
                          </div>
                        </template>
                      </v-data-table>
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
                  :loading="changingProject"
                  @click="changeProject()"
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
import { userSession } from '@/userSession';

export default {
  name: 'ProjektEditieren',
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data: () => ({
    userProjects: [],
    gotResponse: false,
    apiurl: window.apiurl,
    overlay: false,
    editElement: null,
    alert: false,
    alertType: null,
    userFeedback: '',
    form: false,
    loading: true,
    changingProject: false,
    tableHeaders: [
      {
        text: 'Meilensteinname',
        align: 'start',
        sortable: false,
        value: 'milestoneName',
      },
      { text: 'Spendenziel', value: 'goal' },
      { text: 'Meilensteinende', value: 'until' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    newMilestones: [],
    newMile: {
      milestoneName: '',
      goal: null,
      until: null,
    },
    today: null,
    milestoneDialog: false,
    editMilestoneDialog: false,
    minWei: 1,
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
    },
    err: {
      picErr: 0,
      normErr: 0,
    },
  }),
  computed: {
    allMilestones() {
      return [...this.editElement.milestones, ...this.newMilestones].map((milestone) => {
        const mCopy = JSON.parse(JSON.stringify(milestone));
        mCopy.newIndex = this.newMilestones.indexOf(milestone);
        // until * 1000, weil ms auf s umgerechnet wird
        mCopy.until = new Date(mCopy.until * 1000).toLocaleDateString();
        return mCopy;
      });
    },
    smallScreen() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    weiRule() {
      return [
        (v) => {
          if (!!v || v === null) {
            if (/^[1-9][0-9]*$/s.test(v) || v === null) {
              if (v > this.minWei || v === null) {
                return true;
              }
              return `Ziel muss über ${this.minWei} liegen`;
            }
            return 'Bitte nur ganze Zahlen eingeben';
          }
          return 'Feld muss ausgefüllt werden';
        },
      ];
    },
  },
  mounted() {
    this.load();
    this.getTodaysDate();
  },
  methods: {
    load() {
      this.loading = true;
      setTimeout(() => {
        axios.get(`projects?username=${window.user.username}`)
          .then((res) => {
            if (res.data.length > 0) {
              this.userProjects = res.data;
            }
          })
          .catch((err) => {
            this.showAlert(err.toString(), 'error');
          })
          .finally(() => {
            this.gotResponse = true;
            this.resultList = this.userProjects;
            this.loading = false;
          });
      }, 400);
    },
    getTodaysDate() {
      this.today = new Date().toISOString().substring(0, 10);
    },
    closeDialog() {
      this.newMile.milestoneName = '';
      this.newMile.goal = null;
      this.newMile.until = null;

      this.milestoneDialog = false;
    },
    // Noch nicht volständig implementiert
    editMilestone(milestone) {
      this.newMile = milestone;
      // in this case "5.9.2020" -> "5-9-2020" -> 2020-9-5
      let newTime = JSON.parse(JSON.stringify(this.newMile));
      newTime = newTime.until.split('.').reverse().join('-');
      this.newMile.until = new Date(newTime).toISOString().substring(0, 10);
      this.editMilestoneDialog = true;
    },
    isNewMilestone(item) {
      try {
        return item.newIndex > -1;
      } catch (e) {
        // Just dont show edit options
        return 0;
      }
    },
    deleteMilestone(milestone) {
      try {
        if (milestone.newIndex > -1) {
          this.newMilestones.splice(milestone.newIndex, 1);
        }
      } catch (e) {
        // Do nothing (or print err msg)
      }
    },
    saveMilestone() {
      const dateStone = JSON.parse(JSON.stringify(this.newMile));
      // until / 1000 --> s auf ms umrechnen
      dateStone.until = new Date(dateStone.until).getTime() / 1000;
      this.newMilestones.push(dateStone);
      this.closeDialog();
    },
    setMarkerPos(event) {
      this.marker = event.latlng;
      this.editElement.latitude = this.marker.lat;
      this.editElement.longitude = this.marker.lng;
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
    editClick(itemId) {
      let projectId = -1;
      try {
        projectId = parseInt(itemId, 10);
      } catch (e) {
        return;
      }

      if (Number.isInteger(projectId) && projectId > 0) {
        axios.get(`projects/${projectId}`)
          .then((res) => {
            this.editElement = res.data;
            this.editElement.description = window.atob(res.data.description);
            this.editElement.authToken = userSession.getAuthResponseToken();
            this.editElement.picture = null;
            // until * 1000 --> s auf ms
            this.editElement.until = new Date(this.editElement.until * 1000).toISOString().substring(0, 10);

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
            }, 100);

            // Set min WEI amount for new milestones
            this.editElement.milestones.forEach((mile) => {
              if (mile.goal > this.minWei) {
                this.minWei = mile.goal;
              }
            });
          })
          .catch((err) => {
            this.showAlert(`Das Projekt konnte nicht geladen werden: ${err.toString()}`, 'error');
          });
      }
    },
    async changeProject() {
      if (userSession.isUserSignedIn()) {
        const authToken = userSession.loadUserData().authResponseToken;
        const headers = {
          id: this.editElement.id,
          authToken,
        };
        if (this.editElement.webpage) headers.webpage = this.editElement.webpage;
        if (this.editElement.description) headers.description = window.btoa(this.editElement.description);
        if (this.editElement.latitude) headers.latitude = this.editElement.latitude;
        if (this.editElement.longitude) headers.longitude = this.editElement.longitude;
        if (this.newMilestones.length > 0) {
          headers.milestones = this.newMilestones.sort((a, b) => a.goal - b.goal)
            .map((mile) => {
              const formattedMile = JSON.parse(JSON.stringify(mile));
              formattedMile.name = formattedMile.milestoneName;
              delete formattedMile.milestoneName;

              // required Votes muss man mitsenden, wird aber nicht verwendet
              formattedMile.requiredVotes = 1337;

              return formattedMile;
            });
          headers.milestones = JSON.stringify(headers.milestones);
        }
        this.changingProject = true;
        axios.patch(`projects/${this.editElement.id}`, null, { headers })
          .catch(() => {
            this.err.normErr = 1;
          }).finally(async () => {
            if (this.editElement.picture !== null) {
              this.postPic(authToken, this.editElement.picture)
                .then(() => {
                  this.sentStauts();
                  this.changingProject = false;
                  this.load();
                  this.overlay = false;
                });
            } else {
              this.sentStauts();
              this.changingProject = false;
              this.load();
              this.overlay = false;
            }
          });
      }
    },
    async postPic(authToken, pic) {
      const headers = {
        idProject: this.editElement.id,
        authToken,
      };
      const formData = new FormData();
      formData.append('file', pic);

      await axios.post('file', formData, { headers })
        .catch(() => {
          this.err.picErr = 1;
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
      this.newMilestones = [];
    },
    closeOverlay() {
      this.overlay = false;
      this.editElement = {};
      this.newMilestones = [];
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

  .newProject {
    position: absolute;
    top: 5px;
    right:10px;
  }
</style>
