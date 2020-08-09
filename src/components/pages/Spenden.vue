<template>
  <div>
    <v-container no-gutters>
      <h1>Spenden</h1>
      <h3>Suche nach Spendenprojekte in deiner Nähe!</h3>
      <MySearch
        v-model="searchModel"
        placeholder="des Projekts"
        @search="suchen"
        @reset="reset"
      />
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
        v-if="errorMessage || searchModel.errorMessage"
        :value="true"
        type="error"
      >
        <div
          v-for="line in `${errorMessage ? errorMessage+'\n' : ''}${searchModel.errorMessage}`.split('\n')"
          :key="line"
        >
          {{ line }}<br>
        </div>
      </v-alert>
      <div
        v-else-if="gotResponse"
      >
        <v-row>
          <v-col
            v-for="item in resultList"
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
import MySearch from '../MySearch.vue';

export default {
  name: 'Spenden',
  components: {
    MySearch,
    MyCard,
  },
  data: () => ({
    loadLocation: false,
    loading: false,
    items: [],
    gotResponse: false,
    errorMessage: '',
    resultList: [],
    apiurl: window.apiurl,
    searchModel: {
      name: '',
      place: '',
      lCodes: ['DE', 'AT', 'CH'],
      code: 'DE',
      radius: 10,
      latitude: -1,
      longitude: -1,
      errorMessage: '',
    },
  }),
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
    reset() {
      this.errorMessage = '';
      this.gotResponse = false;
      this.load();
    },
    loadProjects() {
      if (this.searchModel.name || (this.searchModel.longitude !== -1 && this.searchModel.latitude !== -1)) {
        let url = '';
        url = 'projects?name=';
        if (this.searchModel.name) {
          url = url.concat(`${this.searchModel.name}`);
        }
        if (this.searchModel.longitude !== -1 && this.searchModel.latitude !== -1) {
          url = url.concat(`&longitude=${this.searchModel.longitude}&latitude=${this.searchModel.latitude}&radius=${this.searchModel.radius}`);
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
      if (this.searchModel.place && this.searchModel.code) {
        let url = `https://nominatim.openstreetmap.org/search?countrycodes=${this.searchModel.code}&format=json&limit=1`;
        if (typeof this.searchModel.place === 'number' || (this.searchModel.place % 1) === 0) {
          url = url.concat(`&postalcode=${this.searchModel.place}`);
        } else {
          url = url.concat(`&city=${this.searchModel.place}`);
        }
        axios.get(url)
          .then((res) => {
            if (res.data.length !== 0) {
              this.searchModel.longitude = res.data[0].lon;
              this.searchModel.latitude = res.data[0].lat;
            }
            if (this.searchModel.latitude === -1 || this.searchModel.longitude === -1) {
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
      } else if (this.searchModel.errorMessage === '' || (this.searchModel.longitude !== -1 && this.searchModel.latitude !== -1)) {
        this.loadProjects();
      }
    },
  },
};
</script>


<style scoped>
</style>
