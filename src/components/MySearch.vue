<template>
  <v-form>
    <v-container fluid>
      <v-row dense>
        <v-col
          cols="12"
          sm="6"
          lg="3"
        >
          <v-text-field
            v-model="value.name"
            prepend-inner-icon="mdi-magnify"
            :label="`Name ${placeholder}`"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="3"
        >
          <v-select
            v-model="value.code"
            :items="value.lCodes"
            label="Ländercode"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="3"
        >
          <v-text-field
            v-model="value.place"
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
            v-model.number="value.radius"
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
            Zurücksetzen
          </v-btn>
        </v-col>
        <v-col />
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: 'MySearch',
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        place: '',
        lCodes: ['DE', 'AT', 'CH'],
        code: 'DE',
        radius: 10,
        latitude: -1,
        longitude: -1,
        errorMessage: '',
      }),
    },
    placeholder: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    loadLocation: false,
  }),

  computed: {
    locationButton() {
      if (this.value.latitude !== -1 && this.value.longitude !== -1) {
        return 'success';
      }
      return 'primary';
    },
    searchButton() {
      return !(this.value.name !== '' || (this.value.longitude !== -1 && this.value.latitude !== -1) || (this.value.place !== '' && this.value.code !== ''));
    },
  },

  methods: {
    getOwnLocation() {
      if (!('geolocation' in navigator)) {
        this.errorMessage = 'Geolocation ist nicht verfügbar';
        return;
      }
      this.loadLocation = true;
      navigator.geolocation.getCurrentPosition((pos) => {
        // this.location = pos;
        this.value.longitude = pos.coords.longitude;
        this.value.latitude = pos.coords.latitude;
        this.loadLocation = false;
      }, (err) => {
        this.loadLocation = false;
        this.value.errorMessage = `${err.toString()} \nDarf die Seite den Standort verwenden?`;
      });
    },
    reset() {
      this.value.name = '';
      this.value.place = '';
      this.value.radius = 10;
      this.value.longitude = -1;
      this.value.latitude = -1;
      this.value.errorMessage = '';
      this.$emit('reset');
    },
    suchen() {
      this.$emit('search');
    },
  },
};
</script>

<style scoped>

</style>
