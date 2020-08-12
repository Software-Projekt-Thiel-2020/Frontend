<template>
  <v-container>
    <div class="gradientBackground">
      <div class="titleHeader text-center">
        <h1
          :class="smallDevice ? 'display-0 pl-1 pr-1' : 'display-3'"
          class="font-weight-thin white--text"
        >
          Neues Projekt anlegen
        </h1>
      </div>
    </div>
    <v-form
      v-model="form"
      class="mt-2"
    >
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="project.title"
            label="Projektname*"
            outlined
            clearable
            :rules="notEmpty"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="project.webpage"
            label="Website"
            :rules="websiteRule"
            outlined
            clearable
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          :md="(backend_userdata.length && backend_userdata[0].group === 'support') ? 9 : 12"
        >
          <v-overflow-btn
            v-model="project.idInstitution"
            label="Institution*"
            target="#dropdown-institution"
            :items="allInstitutionsSortedNameId"
            item-text="name"
            item-value="id"
            auto-select-first
            outlined
            clearable
            :rules="notEmpty"
          />
        </v-col>
        <v-col
          v-if="backend_userdata.length && backend_userdata[0].group === 'support'"
          cols="12"
          md="3"
        >
          <v-btn
            class="mt-2 ml-1"
            style="text-transform: none"
            to="/institution"
            block
          >
            Neue Institution erstellen
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          sm="4"
        >
          <v-text-field
            v-model="project.goal"
            oninput="validity.valid||(value='');"
            label="Spendenziel* (WEI)"
            outlined
            type="number"
            clearable
            :rules="weiRule"
          />
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
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
                :rules="notEmpty"
                label="Projektende*"
                readonly
                outlined
                clearable
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="date"
              :min="minDate"
              @input="afterDayInput"
            />
          </v-menu>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
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
                :disabled="blockTime"
                :rules="notEmpty"
                label="Uhrzeit* (GMT)"
                readonly
                outlined
                clearable
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-time-picker
              v-model="time"
              format="24hr"
              @input="afterTimeInput"
            />
          </v-menu>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="project.short"
            label="Kurz-Beschreibung*"
            outlined
            counter
            maxlength="140"
            clearable
            :rules="textRule"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="project.description"
            label="Beschreibung*"
            clearable
            counter
            no-resize
            outlined
            height="120"
            :rules="textRule"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          md="7"
        >
          <l-map
            ref="map"
            style="height: 300px; width: 100%; position:relative; z-index: 0"
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
            @click="setMarkerPos"
          >
            <l-tile-layer
              :url="url"
              :attribution="attribution"
            />
            <l-marker :lat-lng="marker" />
          </l-map>
        </v-col>
        <v-col>
          <v-row>
            <v-col>
              <v-text-field
                v-model="project.latitude"
                label="Latitude"
                outlined
                type="number"
                :rules="coordRules"
                @change="updateMap(project.latitude, null)"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="project.longitude"
                label="Longitude"
                outlined
                type="number"
                :rules="coordRules"
                @change="updateMap(null, project.longitude)"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="milestonesDate"
          >
            <template v-slot:top>
              <v-toolbar
                flat
                color="white"
              >
                <v-toolbar-title>Weitere Meilensteine</v-toolbar-title>
                <v-spacer />
                <v-dialog
                  v-model="dialog2"
                  max-width="400"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :disabled="blockAdditionalMilestones"
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon
                        v-if="$vuetify.breakpoint.xsOnly"
                      >
                        mdi-plus-thick
                      </v-icon>
                      <span
                        v-else
                      >
                        Neuer Meilenstein
                      </span>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Meilensteinname*"
                              outlined
                              clearable
                              :rules="milestoneNameRule"
                            />
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editedItem.goal"
                              label="Spendenziel* (WEI)"
                              min="1"
                              type="number"
                              outlined
                              clearable
                              :rules="milestoneWeiRule"
                            />
                          </v-col>
                          <v-col>
                            <v-date-picker
                              v-model="editedItem.until"
                              :min="minDate"
                              :max="date"
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="cancel"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        :disabled="editedItem.name === null || editedItem.goal === null || editedItem.until === null"
                        color="blue darken-1"
                        text
                        @click="save"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p class="ml-2 text-left font-weight-light">
            Mit * markierte Felder müssen ausgefüllt werden
          </p>
          <v-layout
            justify-center
          >
            <v-btn
              :disabled="!form || project.milestones.length === 0"
              color="success"
              class="font-weight-medium ma-2"
              elevation="2"
              large
              :loading="loading"
              @click="calcMainUntil()"
            >
              Spendenprojekt anlegen
            </v-btn>
          </v-layout>
        </v-col>
      </v-row>
    </v-form>
    <v-snackbar
      v-model="dialog.successful"
      top
      color="success"
    >
      Spendenprojekt erstellt!
    </v-snackbar>
    <v-snackbar
      v-if="dialog.body"
      v-model="dialog.error"
      top
      color="error"
    >
      Spendenprojekt konnte nicht erstellt werden: {{ dialog.errorMessage }} ({{ dialog.body }})
    </v-snackbar>
    <v-snackbar
      v-else
      v-model="dialog.error"
      top
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
    <v-snackbar
      v-model="user.error"
      top
      color="error"
    >
      Benutzerdaten konnten nicht geladen werden {{ user.errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import { latLng } from 'leaflet';
import { userSession } from '@/userSession';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'ProjektAnlegen',
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data: () => ({
    form: false,
    milestonesDate: [],
    shortRule: [
      (v) => !!v || 'Feld muss ausgefüllt werden',
      // eslint-disable-next-line no-control-regex
      (v) => /^[\x00-\x7F]+$/is.test(v) || 'Bitte nur gültige Zeichen eingeben(Latin1)',
    ],
    textRule: [
      (v) => !!v || 'Feld muss ausgefüllt werden',
      // eslint-disable-next-line no-control-regex
      (v) => /^([\u0000-\u00ff]*[0-9]*)+$/i.test(v) || 'Bitte nur gültige Zeichen eingeben(Latin1)',
    ],
    milestoneNameRule: [
      (v) => (!!v || v === null) || 'Feld muss ausgefüllt werden',
      // eslint-disable-next-line no-control-regex
      (v) => /^([\u0000-\u00ff]*[0-9]*)+$/i.test(v) || 'Bitte nur gültige Zeichen eingeben(Latin1)',
    ],
    notEmpty: [
      (v) => !!v || 'Feld muss ausgefüllt werden',
    ],
    websiteRule: [
      (v) => (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/is.test(v) || v === '') || 'Bitte eine gültige URL angeben',
    ],
    coordRules: [
      (v) => /^-?[0-9]+\.?[0-9]*$/s.test(v) || 'Bitte nur Zahlen eingeben',
    ],
    blockTime: true,
    blockAdditionalMilestones: true,
    dialog: {
      notLoggedIn: false,
      successful: false,
      error: false,
      errorMessage: '',
      body: '',
    },
    dialog2: false,
    dialog3: {
      timeMissing: true,
      titleMissing: true,
      goalMissing: false,
    },
    headers: [
      {
        text: 'Meilensteinname',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Spendenziel', value: 'goal' },
      { text: 'Meilensteinende', value: 'until' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedIndex: -1,
    preEditedItem: {
      name: null,
      goal: null,
      requiredVotes: 1,
      until: null,
    },
    editedItem: {
      name: null,
      goal: null,
      requiredVotes: 1,
      until: null,
    },
    defaultItem: {
      name: null,
      goal: null,
      requiredVotes: 1,
      until: null,
    },
    userSession: null,
    userData: null,
    error: false,
    dateMenu: false,
    timeMenu: false,
    date: '',
    minDate: '',
    time: '',
    allInstitutions: [],
    allInstitutionsSortedNameId: [],
    project: {
      title: null,
      webpage: '',
      short: '',
      description: '',
      idInstitution: null,
      requiredVotes: 1,
      goal: 10,
      until: 0,
      milestones: [],
      longitude: '',
      latitude: '',
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
    loading: false,
    user: {
      errorMessage: '',
      error: false,
    },
    backend_userdata: [],
  }),
  computed: {
    smallDevice() {
      return this.$vuetify.breakpoint.name === 'xs';
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Neuer Meilenstein' : 'Meilenstein bearbeiten';
    },
    weiRule() {
      return [
        (v) => {
          if (!!v || v === null) {
            if (/^[1-9][0-9]*$/s.test(v) || v === null) {
              // eslint-disable-next-line no-undef
              if (BigInt(v) >= 10 || v === null) {
                // eslint-disable-next-line no-undef
                if (BigInt(v) < 9e32 || v === null) {
                  return true;
                }
                return 'Zahl muss kleiner als 9e32 sein';
              }
              return 'Zahl muss mindestens 10 sein';
            }
            return 'Bitte nur ganze Zahlen eingeben';
          }
          return 'Feld muss ausgefüllt werden';
        },
      ];
    },
    milestoneWeiRule() {
      return [
        (v) => {
          if (v === null) {
            return true;
          }
          if (v) {
            if (/^[1-9][0-9]*$/s.test(v)) {
              // eslint-disable-next-line no-undef
              if (BigInt(this.project.goal) > BigInt(v)) {
                if (this.checkMilestoneGoals(v)) {
                  return true;
                }
                return 'Meilenstein-Ziele dürfen nicht gleich sein';
              }
              return `Ziel muss unter ${this.project.goal} liegen`;
            }
            return 'Bitte nur ganze Zahlen eingeben';
          }
          return 'Feld muss ausgefüllt werden';
        },
      ];
    },
  },
  created() {
    this.userSession = userSession;
  },
  mounted() {
    if (userSession.isUserSignedIn()) {
      this.userData = userSession.loadUserData();
    } else {
      this.dialog.notloggedIn = true;
    }
    this.$refs.map.mapObject.invalidateSize();
    this.getMinDate();
    this.getUserInstitutions();
    this.get_user();
  },
  methods: {
    checkMilestoneGoals(value) {
      if (this.project.milestones.length < 1) {
        return true;
      }
      if (this.editedIndex > 0) {
        const miles = JSON.parse(JSON.stringify(this.project.milestones));
        miles.splice(this.project.milestones, 1);
        const goalArray = miles.map((milestone) => milestone.goal);
        const notAvailable = new Set(goalArray);
        return !notAvailable.has(value);
      }
      const goalArray = this.project.milestones.map((milestone) => milestone.goal);
      // eslint-disable-next-line no-undef
      return !goalArray.some((mile) => BigInt(mile) === BigInt(value));
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
    setMarkerPos(event) {
      this.marker = event.latlng;
      this.project.latitude = this.marker.lat;
      this.project.longitude = this.marker.lng;
    },
    calcUntil() {
      const dateArray = this.date.split(('-'), 3);
      const timeArray = this.time.split((':'), 2);
      this.project.until = Date.UTC(parseInt(dateArray[0], 10), parseInt(dateArray[1], 10), parseInt(dateArray[2], 10),
        parseInt(timeArray[0], 10), parseInt(timeArray[1], 10));
    },
    afterDayInput() {
      this.dateMenu = false;
      this.blockTime = false;
    },
    afterTimeInput() {
      this.timeMenu = false;
      this.blockAdditionalMilestones = false;
      this.calcUntil();
    },
    editItem(item) {
      this.editedIndex = this.project.milestones.indexOf(item);

      const copy = JSON.parse(JSON.stringify(item));
      // in this case "5.9.2020" --> 2020-9-5
      const [day, month, year] = copy.until.split('.');
      copy.until = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      this.editedItem = { ...copy };
      this.preEditedItem = { ...copy };
      this.deleteItem(item);
      this.dialog2 = true;
    },
    deleteItem(item) {
      const index = this.project.milestones.indexOf(item);
      this.project.milestones.splice(index, 1);
      const displayIndex = this.milestonesDate.indexOf(item);
      this.milestonesDate.splice(displayIndex, 1);
    },
    cancel() {
      this.editedItem = { ...this.preEditedItem };
      if (this.editedItem.goal === this.defaultItem.goal
          && this.editedItem.name === this.defaultItem.name
          && this.editedItem.requiredVotes === this.defaultItem.requiredVotes
          && this.editedItem.until === this.defaultItem.until) {
        // neuer Meilenstein wurde gecanceled
        this.close();
      } else {
        // Meilenstein bearbeiten wurde gecanceled
        this.save();
      }
    },
    close() {
      this.dialog2 = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.preEditedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },
    save() {
      const dateArray = this.editedItem.until.split(('-'), 3);
      dateArray[1] -= 1;
      // durch 1000 weil von ms auf sekunden umgerechnet wird
      const date = Date.UTC(parseInt(dateArray[0], 10), parseInt(dateArray[1], 10), parseInt(dateArray[2], 10)) / 1000;
      if (this.editedIndex > -1) {
        this.project.milestones[this.project.milestones.length - 1].until = date;
        Object.assign(this.project.milestones[this.editedIndex], this.editedItem);
      } else {
        this.project.milestones.push(this.editedItem);
      }
      // Für die User Anzeige des Datums
      const cpy = JSON.parse(JSON.stringify(this.project.milestones[this.project.milestones.length - 1]));
      cpy.until = new Date(cpy.until).toLocaleDateString();
      this.milestonesDate.push(cpy);
      this.close();
    },
    getMinDate() {
      this.minDate = new Date();
      // Smart Contracts: min: today + 1 day
      this.minDate = this.minDate.setDate(this.minDate.getDate() + 1);
      this.minDate = new Date(this.minDate).toISOString().substring(0, 10);
    },
    getUserInstitutions() {
      axios.get(`institutions?username=${window.user.username}`)
        .then((res) => {
          this.allInstitutions = res.data;
          for (let i = 0; i < this.allInstitutions.length; i += 1) {
            this.allInstitutionsSortedNameId.push({
              name: this.allInstitutions[i].name,
              id: this.allInstitutions[i].id,
            });
          }
        });
    },
    calcMainUntil() {
      this.dialog3.timeMissing = this.project.until === 0;
      this.dialog3.titleMissing = this.project.title === null;
      // BitInt probably not needed
      this.dialog3.goalMissing = this.project.goal <= 0;
      if (this.dialog3.titleMissing === false && this.dialog3.timeMissing === false && this.dialog3.goalMissing === false) {
        this.createSpendenProjekt();
      }
    },
    createSpendenProjekt() {
      this.loading = true;
      const headers = {
        authToken: this.userData.authResponseToken,
        name: this.project.title,
        idInstitution: this.project.idInstitution,
        goal: this.project.goal,
        // until / 1000 --> Umrechnen von ms auf s
        until: this.project.until / 1000,
        short: window.btoa(this.project.short),
        description: window.btoa(this.project.description),
      };
      if (this.project.webpage !== '') {
        headers.webpage = this.project.webpage;
      }
      if (this.project.milestones.length !== 0) {
        headers.milestones = this.project.milestones.sort((a, b) => a.goal - b.goal);
        headers.milestones = headers.milestones.map((mile) => {
          const cpy = mile;
          // until / 1000 -> Umrechnung von ms auf s
          cpy.until = new Date(mile.until).getTime() / 1000;
          return cpy;
        });
        headers.milestones = JSON.stringify(headers.milestones);
      }
      if (this.project.latitude !== '') {
        headers.latitude = this.project.latitude;
      }
      if (this.project.longitude !== '') {
        headers.longitude = this.project.longitude;
      }
      axios.post('/projects', {}, { headers })
        .then(() => {
          this.dialog.successful = true;
        })
        .catch((err) => {
          this.dialog.errorMessage = err.toString();
          this.dialog.error = true;
          if (err.response) {
            this.dialog.body = err.response.data.error;
          }
        }).finally(() => {
          this.loading = false;
        });
    },
    get_user() {
      axios.get(`users?username=${this.userData.username}`)
        .then((res) => {
          if (res.data.length > 0) {
            this.backend_userdata = res.data;
          } else {
            this.backend_userdata = [];
          }
        })
        .catch((err) => {
          this.user.errorMessage = err.toString();
          this.user.error = true;
        })
        .finally(() => {
          this.gotResponse = true;
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
    background: rgb(255, 255, 255) linear-gradient(to right, rgb(199, 255, 212), rgb(176, 218, 255));
  }
</style>
