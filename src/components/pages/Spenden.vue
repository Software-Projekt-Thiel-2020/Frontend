<template>
  <div>
    <v-container class="mt-2">
      <h1>Spenden</h1>
    </v-container>
    <v-container>
      <h3>Suche nach Spendenprojekte in deiner Nähe!</h3>
      <v-form class="form-box ml-0">
        <v-container>
          <v-row>
            <v-col
              cols="4"
            >
              <v-text-field
                v-model="searchName"
                prepend-inner-icon="mdi-magnify"
                label="Name des Betriebs"
              />
            </v-col>
            <v-col
              cols="2"
            >
              <v-select
                v-model="searchCode"
                :items="lCodes"
                label="Ländercode"
              />
            </v-col>
            <v-col
              cols="3"
            >
              <v-text-field
                v-model="searchPlace"
                prepend-inner-icon="mdi-magnify"
                label="Stadt/PLZ"
              />
            </v-col>
            <v-col
              cols="2"
            >
              <v-text-field
                v-model="radius"
                prepend-inner-icon="mdi-radius-outline"
                label="Radius(km)"
              />
            </v-col>
            <v-col
              cols="1"
            >
              <v-btn
                fab
                class="mt-1"
                :color="locationButton"
                label="Mich finden"
                @click="getOwnLocation"
              >
                <v-icon>mdi-crosshairs-gps</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="3"
            >
              <v-btn
                min-width="150"
                max-width="150"
                color="success"
                large
                :disabled="searchButton"
                @click="suchen"
              >
                Suchen
              </v-btn>
            </v-col>
            <v-col
              cols="3"
            >
              <v-btn
                min-width="150"
                max-width="150"
                color="error"
                large
                @click="reset"
              >
                Zurücksetzten
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-container>
    <v-container>
      <h2>Ergebnisse:</h2>
      <div v-if="!gotResponse">
        <v-skeleton-loader>
          <!-- Anzahl an Skeleton-loadern muss hard-coded sein,
           da Anzahl an gefundenen Projekte beim Laden
            nicht herauszufinden ist -->
          v-for="index in 7"
          :key="index"
          class="my-10"
          type="list-item-avatar"
          tile
          />
        </v-skeleton-loader>
      </div>
      <v-alert
        v-if="errorMessage"
        :value="true"
        type="error"
      >
        <div
          v-for="line in errorMessage.split('\n')"
          :key="line"
        >
          {{ line }}<br>
        </div>
      </v-alert>
      <div
        v-else-if="gotResponse"
        class="d-flex flex-row flex-wrap"
        :class="$vuetify.breakpoint.lgAndDown ? 'justify-space-around' : ''"
      >
        <v-card
          v-for="item in resultList"
          :key="item.id"
          class="ma-4 grey lighten-3 text-left"
          outlined
          :max-width="$vuetify.breakpoint.mdAndDown ? 350 : 500"
          :min-width="$vuetify.breakpoint.mdAndDown ? 350 : 500"
          max-height="400"
        >
          <v-row no-gutters>
            <v-col>
              <v-card-title
                class="headline"
              >
                {{ item.name }}
              </v-card-title>
              <v-card-text>
                <v-row no-gutters>
                  <v-col>
                    <span class="font-weight-medium">Bis zum: {{ new Date(item.until * 1000).toLocaleDateString() }}</span>
                  </v-col>
                  <v-col>
                    <a :href="item.webpage">Zur Website</a>
                  </v-col>
                </v-row>
                <p
                  class="mt-3 text-left text-wrap"
                >
                  {{ item.description }}
                </p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  style="bottom: 0; left: 0; position: absolute"
                  :to="'project/'+item.id"
                  class="no-text text-decoration-none ma-2 mt-3"
                >
                  Spenden
                </v-btn>
              </v-card-actions>
            </v-col>
            <v-col
              cols="4"
            >
              <v-img
                class="mb-3 mt-3 pl-6"
                :src="apiurl+'/file/'+item.picturePath"
                alt="/assets/placeholder.png"
                max-width="300"
                max-height="150"
                contain
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Spenden',
  data: () => ({
    items: [],
    gotResponse: false,
    errorMessage: '',
    searchName: '',
    searchPlace: '',
    resultList: [],
    longitude: -1,
    latitude: -1,
    radius: 10,
    lCodes: ['DE', 'AT', 'CH'],
    searchCode: 'DE',
    apiurl: window.apiurl,
  }),
  computed: {
    locationButton() {
      if (this.latitude !== -1 && this.longitude !== -1) {
        return 'success';
      }
      return 'primary';
    },
    searchButton() {
      return !(this.searchName !== '' || (this.longitude !== -1 && this.latitude !== -1) || (this.searchPlace !== '' && this.searchCode !== ''));
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      axios.get('projects')
        .then((res) => {
          this.items = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.toString();
        })
        .finally(() => {
          this.gotResponse = true;
          this.resultList = this.items;
        });
    },
    getOwnLocation() {
      if (!('geolocation' in navigator)) {
        this.errorMessage = 'Geolocation ist nicht verfügbar';
        return;
      }
      navigator.geolocation.getCurrentPosition((pos) => {
        this.location = pos;
        this.longitude = pos.coords.longitude;
        this.latitude = pos.coords.latitude;
      }, (err) => {
        this.errorMessage = `${err.toString()} \nDarf die Seite den Standort verwenden?`;
      });
    },
    reset() {
      this.searchName = '';
      this.searchPlace = '';
      this.longitude = -1;
      this.latitude = -1;
      this.radius = 10;
      this.errorMessage = '';
      this.load();
    },
    loadProjects() {
      if (this.searchName || (this.longitude !== -1 && this.latitude !== -1)) {
        let url = '';
        url = 'projects?name=';
        if (this.searchName) {
          url = url.concat(`${this.searchName}`);
        }
        if (this.longitude !== -1 && this.latitude !== -1) {
          url = url.concat(`&longitude=${this.longitude}&latitude=${this.latitude}&radius=${this.radius}`);
        }
        axios.get(url)
          .then((res) => {
            this.resultList = res.data;
            if (this.resultList.length === 0) {
              this.errorMessage = 'Es konnten keine Projekte gefunden werden';
            }
          })
          .catch((err) => {
            this.errorMessage = err.toString();
          });
      }
    },
    suchen() {
      this.errorMessage = '';
      if (this.searchPlace && this.searchCode) {
        let url = `https://nominatim.openstreetmap.org/search?countrycodes=${this.searchCode}&format=json&limit=1`;
        if (typeof this.searchPlace === 'number' || (this.searchPlace % 1) === 0) {
          url = url.concat(`&postalcode=${this.searchPlace}`);
        } else {
          url = url.concat(`&city=${this.searchPlace}`);
        }
        axios.get(url)
          .then((res) => {
            if (res.data.length !== 0) {
              this.longitude = res.data[0].lon;
              this.latitude = res.data[0].lat;
            }
            if (this.latitude === -1 || this.longitude === -1) {
              this.errorMessage = 'Es konnten keine Projekte gefunden werden';
            } else {
              this.loadProjects();
            }
          })
          .catch((err) => {
            this.errorMessage = err.toString();
          });
      } else if (this.errorMessage === '' || (this.longitude !== -1 && this.latitude !== -1)) {
        this.loadProjects();
      }
    },
  },
};
</script>


<style scoped>
    .form-box {
        max-width: 700px;
        margin-left: 0px;
    }

    .form-input input {
        border: 1px solid gray;
    }
</style>
