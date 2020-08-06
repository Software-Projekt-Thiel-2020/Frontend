<template>
  <div>
    <v-container no-gutters>
      <h1>Spenden</h1>
      <h3>Suche nach Spendenprojekte in deiner Nähe!</h3>
      <v-form>
        <v-container fluid>
          <v-row dense>
            <v-col
              cols="12"
              sm="6"
              lg="3"
            >
              <v-text-field
                v-model="searchName"
                prepend-inner-icon="mdi-magnify"
                label="Name des Projekts"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              lg="3"
            >
              <v-select
                v-model="searchCode"
                :items="lCodes"
                label="Ländercode"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              lg="3"
            >
              <v-text-field
                v-model="searchPlace"
                prepend-inner-icon="mdi-magnify"
                label="Stadt/PLZ"
              />
            </v-col>
            <v-col
              cols="8"
              sm="5"
              lg="2"
            >
              <v-text-field
                v-model="radius"
                prepend-inner-icon="mdi-radius-outline"
                label="Radius(km)"
              />
            </v-col>
            <v-col
              cols="4"
              sm="1"
              lg="1"
            >
              <v-btn
                fab
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
              cols="12"
              sm="6"
              lg="3"
            >
              <v-btn
                color="success"
                :disabled="searchButton"
                min-width="15em"
                @click="suchen"
              >
                Suchen
              </v-btn>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              lg="3"
            >
              <v-btn
                color="error"
                min-width="15em"
                @click="reset"
              >
                Zurücksetzten
              </v-btn>
            </v-col>
            <v-col />
          </v-row>
        </v-container>
      </v-form>
    </v-container>


    <v-container fluid>
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
      <div
        v-else-if="gotResponse"
      >
        <v-row
          dense
        >
          <v-col
            v-for="item in resultList"
            :key="item.id"
            sm="12"
            md="6"
            lg="4"
            xl="3"
          >
            <MyCard :img-src="item.picturePath ? (apiurl+'/file/'+item.picturePath) : null">
              <template #title>
                {{ item.name }}
              </template>
              <template #subtitle>
                Bis zum: {{ new Date(item.until * 1000).toLocaleDateString() }}
              </template>
              <template #text>
                {{ item.short }}
              </template>
              <template #actions>
                <v-btn
                  color="rgba(0, 0, 0, 0.54)"
                  text
                  width="80%"
                  :to="'project/'+item.id"
                >
                  Spenden
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
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import MyCard from '../MyCard.vue';

export default {
  name: 'Spenden',
  components: {
    MyCard,
  },
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
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
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
        this.errorMessage = `${err.toString()} \nDarf die Seite den Standort verwenden?`;
        this.loadLocation = false;
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
              this.errorMessage = 'Es konnten keine Projekte gefunden werden';
            } else {
              this.loadProjects();
            }
          })
          .catch((err) => {
            this.errorMessage = err.toString();
          }).finally(() => {
            this.gotResponse = true;
            this.loading = false;
          });
      } else if (this.errorMessage === '' || (this.longitude !== -1 && this.latitude !== -1)) {
        this.loadProjects();
      }
    },
  },
};
</script>


<style scoped>
</style>
