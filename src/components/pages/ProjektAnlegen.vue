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
    <v-form
      v-model="form"
    >
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="project.title"
            label="Projektname"
            outlined
            clearable
            :rules="notEmpty"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="project.website"
            label="Link zur Website (optional)"
            :rules="websiteRule"
            outlined
            clearable
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-overflow-btn
            v-model="project.idInstitution"
            label="Institution"
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
            min="1"
            oninput="validity.valid||(value='');"
            label="Spendenziel in Wei"
            outlined
            clearable
            :rules="weiRule"
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
                :rules="notEmpty"
                label="Projektende eingeben"
                readonly
                clearable
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="date"
              :min="today"
              @input="afterDayInput"
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
                :disabled="blockTime"
                :rules="notEmpty"
                label="Uhrzeit eingeben (GMT)"
                readonly
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
          <v-textarea
            v-model="project.description"
            label="Beschreibung"
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
        <v-col cols="7">
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
        <v-col>
          <v-row>
            <v-col>
              <v-text-field
                v-model="project.latitude"
                label="Latitude (optional)"
                outlined
                :rules="numberRule"
                type="number"
                @change="updateMap(project.latitude, null)"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="project.longitude"
                label="Longitude (optional)"
                outlined
                :rules="numberRule"
                type="number"
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
                      Neuer Meilenstein
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
                              label="Meilensteinname"
                              outlined
                              clearable
                              :rules="textRule"
                            />
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editedItem.goal"
                              label="Spendenziel in Wei"
                              min="1"
                              outlined
                              clearable
                              :rules="weiRule"
                            />
                          </v-col>
                          <v-col>
                            <v-date-picker
                              v-model="editedItem.until"
                              :min="today"
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
                        :disabled="editedItem.name === '' || editedItem.goal === '' || editedItem.until === null"
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
        <v-btn
          :disabled="!form"
          color="success"
          class="font-weight-medium ma-2"
          elevation="2"
          @click="calcMainUntil()"
        >
          Spendenprojekt anlegen
        </v-btn>
      </v-row>
    </v-form>
    <v-snackbar
      v-model="dialog.successful"
      bottom
      color="success"
    >
      Spendenprojekt erstellt!
    </v-snackbar>
    <v-snackbar
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
  </v-container>
</template>

<script>
import axios from 'axios';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import { latLng } from 'leaflet';
import { userSession } from '../../userSession';
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
    textRule: [
      // eslint-disable-next-line no-control-regex
      (v) => /^([\u0000-\u00ff]*[0-9]*)+$/i.test(v) || 'Bitte nur gültige Zeichen eingeben(Latin1)',
    ],
    notEmpty: [
      (v) => !!v || 'Feld muss ausgefüllt werden',
    ],
    websiteRule: [
      (v) => (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/is.test(v) || v === '') || 'Bitte eine gültige URL angeben',
    ],
    numberRule: [
      (v) => /^[0-9]*[.,]?[0-9]*$/s.test(v) || 'Bitte nur Zahlen (>0) eingeben',
      (v) => parseFloat(v) > 0 || 'Bitte nur Zahlen (>0) eingeben',
    ],
    blockTime: true,
    blockAdditionalMilestones: true,
    dialog: {
      notLoggedIn: false,
      successful: false,
      error: false,
      errorMessage: '',
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
      name: '',
      goal: null,
      requiredVotes: 1,
      until: null,
    },
    editedItem: {
      name: '',
      goal: null,
      requiredVotes: 1,
      until: null,
    },
    defaultItem: {
      name: '',
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
    today: '',
    time: '',
    allInstitutions: [],
    allInstitutionsSortedNameId: [],
    project: {
      title: null,
      website: '',
      description: '',
      idInstitution: null,
      requiredVotes: 1,
      goal: 1,
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
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Neuer Meilenstein' : 'Meilenstein bearbeiten';
    },
    weiRule() {
      return [
        (v) => {
          if (!!v || v === null) {
            if (/^[1-9][0-9]*$/s.test(v) || v === null) {
              return true;
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
    this.getTodaysDate();
    this.getUserInstitutions();
  },
  methods: {
    updateMap(lat, long) {
      let newCoords;
      if (lat !== null) {
        newCoords = latLng(lat, this.marker.lng);
      }
      if (long !== null) {
        newCoords = latLng(this.marker.lat, long);
      }
      this.marker = newCoords;
      this.center = newCoords;
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
      this.editedItem = { ...item };
      this.preEditedItem = { ...item };
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
    getTodaysDate() {
      this.today = new Date().toJSON().slice(0, 10);
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
      this.dialog3.goalMissing = this.project.goal <= 0;
      if (this.dialog3.titleMissing === false && this.dialog3.timeMissing === false && this.dialog3.goalMissing === false) {
        this.createSpendenProjekt();
      }
    },
    createSpendenProjekt() {
      const headers = {
        authToken: this.userData.authResponseToken,
        name: this.project.title,
        idInstitution: this.project.idInstitution,
        goal: this.project.goal,
        // until / 1000 --> Umrechnen von ms auf s
        until: this.project.until / 1000,
        description: window.btoa(this.project.description),
        // ist required, wird aber nicht verwendet !
        requiredVotes: 1337,
      };
      if (this.project.website !== '') {
        headers.website = this.project.website;
      }
      if (this.project.milestones.length !== 0) {
        headers.milestones = this.project.milestones.sort((a, b) => a.goal - b.goal);
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
