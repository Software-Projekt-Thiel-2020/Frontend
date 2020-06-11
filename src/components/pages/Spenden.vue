<template>
  <div>
    <v-container>
      <h1>Spenden</h1>
    </v-container>
    <v-container>
      <h3>Suche nach Spendenprojekte in deiner Nähe!</h3>
      <v-form class="form-box">
        <v-container>
          <v-row>
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
                v-model="searchProject"
                prepend-inner-icon="mdi-magnify"
                label="Name des Betriebs"
              />
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
                v-model="searchCity"
                prepend-inner-icon="mdi-magnify"
                label="Stadt/PLZ"
              />
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <v-btn
                class="submit"
                type="submit"
              >
                Suchen
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-container>
    <v-container>
      <h2>Ergebnisse:</h2>
      <v-alert
        v-if="errorMessage"
        :value="true"
        type="error"
      >
        Beim Abruf der Daten ist ein Fehler aufgetreten: {{ errorMessage }}
      </v-alert>
      <div v-if="!gotResponse">
        <v-skeleton-loader
          v-for="index in 4"
          :key="index"
          class="my-10"
          type="list-item-avatar"
          tile
        />
      </div>
      <div v-if="gotResponse">
        <v-card
          v-for="item in items"
          :key="item.name"
          class="project"
          elevation="5"
        >
          <img src="../../assets/placeholder.png">
          <div
            class="companyData"
            style="border:0;"
          >
            <h2>Firmenname: {{ item.name }}</h2>
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
    errorMessage: null,
    searchProject: '',
    searchCity: '',
  }),
  mounted() {
    axios.get('projects')
      .then((res) => {
        this.items = res.data;
      })
      .catch((err) => {
        this.errorMessage = err.toString();
      })
      .finally(() => {
        this.gotResponse = true;
      });
  },
};
</script>


<style scoped>

    .submit {
        background-color: #c4b3b0;
        width: 100px;
        font-weight: bold;
        border-radius: 3px;
        border: 1px solid black;
    }

    .project {
        display: flex;
        flex-direction: row;
        margin-bottom: 25px;
    }

    .form-box {
        max-width: 700px;
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
