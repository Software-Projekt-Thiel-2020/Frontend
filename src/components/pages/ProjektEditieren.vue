<template>
  <Default title="Deine Projekte">
    <v-layout
      class="mb-3"
      :justify-center="$vuetify.breakpoint.smAndDown"
      :class="!$vuetify.breakpoint.smAndDown ? 'btnTitleLeft' : ''"
    >
      <v-btn
        to="/projektanlegen"
        color="success"
      >
        Projekt anlegen
      </v-btn>
    </v-layout>

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
                width="80%"
                @click="editClick(item.id)"
              >
                Editieren
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
        Projekt {{ editElement ? editElement.name : '' }} bearbeiten
      </template>

      <template #text>
        <v-container>
          <v-form
            v-model="form"
          >
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
                label="Kurz-Beschreibung"
                counter
                maxlength="140"
                clearable
                :rules="textRule"
              />
            </MyFormRow>

            <MyFormRow title="Beschreibung">
              <Editor
                ref="toastuiEditor"
                :options="editorOptions"
                height="500px"
                initial-edit-type="wysiwyg"
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
                        <v-form v-model="milestoneForm">
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
                                  counter
                                  maxlength="255"
                                  :rules="milestoneNameRule"
                                />
                              </v-col>
                            </v-row>
                            <v-row justify="center">
                              <v-col>
                                <v-text-field
                                  v-model="newMile.goal"
                                  label="Spendenziel in Wei"
                                  outlined
                                  clearable
                                  :rules="weiRule"
                                />
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col class="text-center">
                                <v-date-picker
                                  v-model="newMile.until"
                                  :min="minDate"
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
                              :disabled="newMile.milestoneName === '' || newMile.goal === '' || newMile.until === null || !milestoneForm"
                              color="blue darken-1"
                              text
                              @click="saveMilestone"
                            >
                              Save
                            </v-btn>
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-dialog>
                  </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                  <div
                    v-if="isNewMilestone(item)"
                  >
                    <v-icon
                      small
                      @click="editMilestone(item)"
                    >
                      mdi-pencil
                    </v-icon>
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
              :loading="changingProject"
              @click="changeProject()"
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
import { Editor } from '@toast-ui/vue-editor';

import EventBus from '@/utils/eventBus';
import MyDialog from '../MyDialog.vue';
import MyFormRow from '../MyFormRow.vue';
import Default from '../Default.vue';
import MyCard from '../MyCard.vue';

export default {
  name: 'ProjektEditieren',
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
    userProjects: [],
    gotResponse: false,
    apiurl: window.apiurl,
    overlay: false,
    editElement: {
      milestones: [],
    },
    alert: false,
    alertType: null,
    userFeedback: '',
    form: false,
    loading: true,
    changingProject: false,
    tableHeaders: [
      { text: 'Meilensteinname', align: 'start', value: 'milestoneName' },
      { text: 'Spendenziel', value: 'goal' },
      { text: 'Meilensteinende', value: 'until', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    newMilestones: [],
    newMile: {
      milestoneName: null,
      goal: null,
      until: null,
    },
    minDate: null,
    milestoneDialog: false,
    editFlag: false,
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
    milestoneNameRule: [
      (v) => (!!v || v === null) || 'Feld muss ausgefüllt werden',
      // eslint-disable-next-line no-control-regex
      (v) => /^([\u0000-\u00ff]*[0-9]*)+$/i.test(v) || 'Bitte nur gültige Zeichen eingeben(Latin1)',
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
    previewImage: false,
  }),
  computed: {
    allMilestones() {
      return [...this.editElement.milestones, ...this.newMilestones].map((milestone) => {
        const mCopy = JSON.parse(JSON.stringify(milestone));
        mCopy.newIndex = this.newMilestones.indexOf(milestone);
        // until * 1000, weil ms auf s umgerechnet wird
        mCopy.until = new Date(mCopy.until * 1000).toLocaleDateString('de-DE');
        return mCopy;
      });
    },
    weiRule() {
      return [
        (v) => {
          if (v === null) {
            return true;
          }
          if (v) {
            if (/^[1-9][0-9]*$/s.test(v)) {
              // eslint-disable-next-line no-undef
              if (BigInt(v) > BigInt(this.minWei)) {
                // eslint-disable-next-line no-undef
                if (BigInt(v) < BigInt(this.editElement.goal)) {
                  if (this.checkMilestoneGoals(v)) {
                    return true;
                  }
                  return 'Meilenstein-Ziele dürfen nicht gleich sein';
                }
                return `Ziel muss unter ${this.editElement.goal} liegen`;
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
    this.getMinDate();
  },
  methods: {
    checkMilestoneGoals(value) {
      if (this.newMilestones.length < 1) {
        return true;
      }
      const allArray = JSON.parse(JSON.stringify(this.newMilestones));
      if (this.editFlag) {
        allArray.splice(this.newMile.newIndex, 1);
      }
      const goalArray = allArray.map((milestone) => milestone.goal);
      // eslint-disable-next-line no-undef
      return !goalArray.some((mile) => BigInt(mile) === BigInt(value));
    },
    previewImageUpdate() {
      if (this.previewImage) {
        URL.revokeObjectURL(this.previewImage);
      }
      this.previewImage = URL.createObjectURL(this.editElement.picture);
    },
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
    getMinDate() {
      this.minDate = new Date();
      // Smart Contracts: min: today + 1 day
      this.minDate = this.minDate.setDate(this.minDate.getDate() + 2);
      this.minDate = new Date(this.minDate).toISOString().substring(0, 10);
    },
    editMilestone(milestone) {
      this.newMile = JSON.parse(JSON.stringify(milestone));
      // in this case "5.9.2020" --> 2020-9-5
      const [day, month, year] = this.newMile.until.split('.');
      this.newMile.until = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      this.editFlag = true;
      this.milestoneDialog = true;
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
    closeDialog() {
      this.newMile.milestoneName = null;
      this.newMile.goal = null;
      this.newMile.until = null;

      this.editFlag = false;
      this.milestoneDialog = false;
    },
    saveMilestone() {
      const dateStone = JSON.parse(JSON.stringify(this.newMile));
      // until / 1000 --> s auf ms umrechnen
      dateStone.until = new Date(dateStone.until).getTime() / 1000;

      if (this.editFlag) {
        this.newMilestones.splice(this.newMile.newIndex, 1);
      }
      delete this.newMilestones.newIndex;
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
        this.err.picErr = 0;
        this.err.normErr = 0;
        projectId = parseInt(itemId, 10);
      } catch (e) {
        return;
      }

      if (Number.isInteger(projectId) && projectId > 0) {
        axios.get(`projects/${projectId}`)
          .then((res) => {
            this.editElement = res.data;
            this.editElement.description = res.data.description;
            this.editElement.short = res.data.short;
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
              this.$refs.map.mapObject.setView(this.center, this.zoom, { animation: true });
            }, 100);

            // Set min WEI amount for new milestones
            this.editElement.milestones.forEach((mile) => {
              // eslint-disable-next-line no-undef
              if (BigInt(mile.goal) > BigInt(this.minWei)) {
                this.minWei = mile.goal;
              }
            });
            this.$nextTick(() => {
              this.$refs.toastuiEditor.invoke('reset');
              this.$refs.toastuiEditor.invoke('setMarkdown', this.editElement.description);
            });
          })
          .catch((err) => {
            this.showAlert(`Das Projekt konnte nicht geladen werden: ${err.toString()}`, 'error');
          });
      }
    },
    async changeProject() {
      this.editElement.description = this.$refs.toastuiEditor.invoke('getMarkdown');
      try {
        window.btoa(this.editElement.description);
      } catch (e) {
        EventBus.$emit('new-snackbar', 'Die Beschrebung darf nur gültige (Latin1) Zeichen enthalten',
          'warning', 4000, true);
        return;
      }

      if (userSession.isUserSignedIn()) {
        const authToken = userSession.loadUserData().authResponseToken;
        const headers = {
          id: this.editElement.id,
          authToken,
        };
        if (this.editElement.webpage) headers.webpage = this.editElement.webpage;
        if (this.editElement.short) headers.short = window.btoa(this.editElement.short);
        if (this.editElement.description) headers.description = window.btoa(this.editElement.description);
        if (this.editElement.latitude) headers.latitude = this.editElement.latitude;
        if (this.editElement.longitude) headers.longitude = this.editElement.longitude;
        if (this.newMilestones.length > 0) {
          headers.milestones = this.newMilestones.sort((a, b) => a.goal - b.goal)
            .map((mile) => {
              const formattedMile = JSON.parse(JSON.stringify(mile));
              formattedMile.name = formattedMile.milestoneName;
              delete formattedMile.milestoneName;
              return formattedMile;
            });
          headers.milestones = JSON.stringify(headers.milestones);
        }
        this.changingProject = true;
        if (this.previewImage) {
          URL.revokeObjectURL(this.previewImage);
          this.previewImage = null;
        }
        axios.patch(`projects/${this.editElement.id}`, null, { headers })
          .catch(() => {
            this.err.normErr = 1;
          }).finally(async () => {
            if (this.editElement.picture !== null) {
              this.postPic(authToken, this.editElement.picture)
                .then(() => {
                  this.sentStatus();
                  this.changingProject = false;
                  this.load();
                  this.overlay = false;
                });
            } else {
              this.sentStatus();
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
    sentStatus() {
      if (this.err.normErr === 1) {
        this.showAlert('Das Ändern war nicht erfolgreich', 'error');
      } else if (this.err.picErr === 1) {
        this.showAlert('Das Ändern des Bilds war nicht erfolgreich', 'warning');
      } else if (this.err.normErr === 0 && this.err.picErr === 0) {
        this.showAlert('Das Ändern war erfolgreich', 'success');
      }
      this.newMilestones = [];
    },
    closeOverlay() {
      this.overlay = false;
      this.editElement = {
        milestones: [],
      };
      this.newMilestones = [];
      this.minDate = null;
      this.minWei = 1;
      if (this.previewImage) {
        URL.revokeObjectURL(this.previewImage);
        this.previewImage = null;
      }
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
