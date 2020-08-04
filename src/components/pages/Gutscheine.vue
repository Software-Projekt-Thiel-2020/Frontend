<template>
  <div>
    <v-container class="mt-2">
      <h1>Gutscheine kaufen</h1>
    </v-container>
    <v-container>
      <h3>Suche nach Betrieben in deiner Nähe!</h3>
      <v-form
        v-if="smallToolbar"
        class="form-box ml-0"
      >
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                v-model="searchName"
                prepend-inner-icon="mdi-magnify"
                label="Name des Betriebs"
              />
            </v-col>
            <v-col>
              <v-select
                v-model="searchCode"
                :items="lCodes"
                label="Ländercode"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="5"
            >
              <v-text-field
                v-model="searchPlace"
                prepend-inner-icon="mdi-magnify"
                label="Stadt/PLZ"
              />
            </v-col>
            <v-col
              cols="5"
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
            <v-btn
              class="ma-1"
              min-width="150"
              max-width="150"
              color="success"
              large
              tile
              :disabled="searchButton"
              @click="suchen"
            >
              Suchen
            </v-btn>
            <v-btn
              class="ma-1"
              min-width="150"
              max-width="150"
              color="error"
              large
              tile
              @click="reset"
            >
              Zurücksetzten
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
      <v-form
        v-else
        class="form-box ml-0"
      >
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
                :loading="loadLocation"
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
      <v-layout
        v-if="loading==true"
        justify-center
      >
        <v-progress-circular
          :size="50"
          :width="7"
          color="green"
          indeterminate
        />
      </v-layout>
      <div v-if="!gotResponse">
        <v-skeleton-loader />
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
                <h2 class="ma-3">
                  {{ item.name }}
                </h2>
                <h4 class="ma-3">
                  Zur Website:
                  <a :href="'//'+item.webpage">{{ item.webpage }}</a>
                </h4>
              </div>
              <v-card-actions>
                <router-link :to="'projectGutschein/'+item.id">
                  <v-btn class="spendenButton">
                    Zur Übersicht
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
  name: 'Gutscheine',
  data: () => ({
    loadLocation: false,
    loading: false,
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
    smallToolbar() {
      return this.$vuetify.breakpoint.name === 'xs';
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      axios.get('institutions?has_vouchers=1')
        .then((res) => {
          this.items = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.toString();
        })
        .finally(() => {
          this.gotResponse = true;
          this.resultList = this.items;
          this.loading = false;
        });
    },
    getOwnLocation() {
      if (!('geolocation' in navigator)) {
        this.errorMessage = 'Geolocation ist nicht verfügbar';
        return;
      }
      this.loadLocation = true;
      navigator.geolocation.getCurrentPosition((pos) => {
        this.location = pos;
        this.longitude = pos.coords.longitude;
        this.latitude = pos.coords.latitude;
        this.loadLocation = false;
      }, (err) => {
        this.loadLocation = false;
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
      this.gotResponse = false;
      this.load();
    },
    loadInstitutions() {
      if (this.searchName || (this.longitude !== -1 && this.latitude !== -1)) {
        let url = '';
        url = 'institutions?has_vouchers=1&name=';
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
              this.errorMessage = 'Es konnten keine Institutionen mit Gutscheinen gefunden werden';
            }
          })
          .catch((err) => {
            this.errorMessage = err.toString();
          }).finally(() => {
            this.gotResponse = true;
            this.loading = false;
          });
      } else {
        this.gotResponse = true;
        this.loading = false;
      }
    },
    suchen() {
      this.errorMessage = '';
      this.gotResponse = false;
      this.loading = true;
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
              this.errorMessage = 'Es konnten keine Institutionen mit Gutscheinen gefunden werden';
            } else {
              this.loadInstitutions();
            }
          })
          .catch((err) => {
            this.errorMessage = err.toString();
          }).finally(() => {
            this.gotResponse = true;
            this.loading = false;
          });
      } else if (this.errorMessage === '' || (this.longitude !== -1 && this.latitude !== -1)) {
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

  .elementImage{
    max-width: 200px;
    max-height: 200px;
  }

  .companyData {
    margin-left: 15px;
    flex-basis: 55%
  }
</style>
