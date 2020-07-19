<template>
  <div>
    <v-container>
      <h4 class="display-1 center">
        Wähle eine deiner Institutionen aus, um diese zu editieren.
      </h4>
      <v-divider />
    </v-container>

    <v-container>
      <v-alert
        v-if="errorMessage"
        :value="errorMessage"
        type="error"
        prominent
      >
        <v-row align="center">
          <v-col
            v-for="line in errorMessage.split('\n')"
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
              color="error"
              large
              @click="errorMessage = ''"
            >
              Schließen
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
      <div v-else-if="!gotResponse">
        <v-card
          class="pa-10 ma-5"
          elevation="5"
          color="red lighten-2"
        >
          <h2>
            Es wurden keine Institutionen gefunden.
          </h2>
        </v-card>
      </div>
      <div v-else-if="gotResponse">
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.name"
          >
            <!-- TODO: Noch weitere Infos anzeigen? -->
            <v-card
              class="project"
              elevation="5"
            >
              <img
                class="elementImage"
                :src="item.picturePath ? apiurl+'/file/'+item.picturePath : '../../assets/placeholder.png'"
              >
              <div
                class="companyData"
                style="border:0;"
              >
                <h2 class="ma-3">
                  {{ item.name }}
                </h2>
                <v-card-actions>
                  <router-link :to="'project/'+item.id">
                    <v-btn class="spendenButton">
                      Editieren
                    </v-btn>
                  </router-link>
                </v-card-actions>
              </div>
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
  name: 'InstitutionEditieren',
  data: () => ({
    items: [],
    gotResponse: false,
    errorMessage: '',
    apiurl: window.apiurl,
  }),

  mounted() {
    // TODO: nur die Institutionen des Besitzers anzeigen
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
};
</script>

<style scoped>

  .project {
    display: flex;
    flex-direction: row;
    margin-bottom: 25px;
  }

  .spendenButtonn {
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
