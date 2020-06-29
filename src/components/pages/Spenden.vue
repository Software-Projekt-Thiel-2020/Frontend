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
                label="Radius"
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
           da Anzahl an gefundenen Institutionen beim Laden
            nicht herauszufinden ist -->
          v-for="index in 7"
          :key="index"
          class="my-10"
          type="list-item-avatar"
          tile
          />
        </v-skeleton-loader>
      </div>
      <!-- ToDo: Zeilenumbruch ohne v-html -->
      <v-alert
        v-if="errorMessage"
        :value="true"
        type="error"
        v-html="errorMessage"
      />
      <div v-else-if="gotResponse">
        <v-row>
          <v-col
            v-for="item in resultList"
            :key="item.name"
          >
            <v-card
              class="project"
              elevation="5"
            >
              <img src="../../assets/placeholder.png">
              <div
                class="companyData"
                style="border:0;"
              >
                <h2>{{ item.name }}</h2>
                <h4>
                  Zur Website:
                  <a :href="item.webpage">{{ item.webpage }}</a>
                </h4>
              </div>
              <v-card-actions>
                <router-link :to="'project/'+item.id">
                  <v-btn class="spendenButton">
                    Spenden
                  </v-btn>
                </router-link>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
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
    radius: 0,
    lCodes: ['DE', 'PL', 'USA'],
    searchCode: 'DE',
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
      axios.get('institutions')
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
        this.errorMessage = `${err.toString()}<br>Darf die Seite den Standort verwenden?`;
      });
    },
    reset() {
      this.searchName = '';
      this.searchPlace = '';
      this.longitude = -1;
      this.latitude = -1;
      this.radius = 1;
      this.errorMessage = '';
      this.load();
    },
    loadInstitutions() {
      if (this.searchName || (this.longitude !== -1 && this.latitude !== -1)) {
        let url = '';
        url = 'institutions?name=';
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
              this.errorMessage = 'Es konnten keine Institutionen gefunden werden';
            }
          })
          .catch((err) => {
            this.errorMessage = err.toString();
          });
      }
    },
    suchen() {
      if (this.latitude === -1 || this.longitude === -1) {
        if (this.searchPlace && this.searchCode) {
          axios.get(`https://nominatim.openstreetmap.org/search?countrycodes=${this.searchCode}&postalcode=${this.searchPlace}&format=json&limit=1`)
            .then((res) => {
              if (res.data.length !== 0) {
                this.longitude = res.data[0].lon;
                this.latitude = res.data[0].lat;
              }
              if (this.latitude === -1 || this.longitude === -1) {
                this.errorMessage = 'Es konnten keine Institutionen gefunden werden';
              } else {
                this.loadInstitutions();
              }
            })
            .catch((err) => {
              this.errorMessage = err.toString();
            });
        }
      }
      // else nur nach namen suchen
      if (this.errorMessage === '') {
        this.loadInstitutions();
      }
    },
  },
};
</script>


<style scoped>

    .project {
        display: flex;
        flex-direction: row;
        margin-bottom: 25px;
    }

    .form-box {
        max-width: 700px;
        margin-left: 0px;
    }

    .spendenButton {
        align-self: flex-end;
        margin-bottom: 15px;
        margin-right: 15px;
        font-size: 1.5rem;
        text-decoration: none;
    }

    .form-input input {
        border: 1px solid gray;
    }


    .companyData {
        margin-left: 15px;
        flex-basis: 55%
    }
</style>
