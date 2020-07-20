<template>
  <div>
    <v-btn @click="showAlert('test', 'success')"></v-btn>
    <v-container>
      <h4 class="display-1 center">
        Wähle eine deiner Institutionen aus, um diese zu editieren.
      </h4>
      <v-divider />
    </v-container>

    <v-container>
      <!-- TODO: V-Alert ist beim Laden kurz zu sehen -->
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
      <div v-if="!gotResponse || items.size === 0">
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
            class="ma-4"
          >
            <v-card
              class="institution"
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
                  <v-btn
                    class="ma-2"
                    style="color: black"
                    @click="editClick(item)"
                  >
                    Editieren
                  </v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <!-- TODO: Inst Cards verrutschen! -->
        <v-dialog
          v-if="overlay"
          v-model="overlay"
          absolute
          persistent
        >
          <v-card>
            <v-card-title>
              Institution bearbeiten
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form>
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      cols="2"
                    >
                      <h4>Institutionsname:</h4>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="editElement.name"
                        :placeholder="editElement.name"
                      />
                    </v-col>
                  </v-row>
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      cols="2"
                    >
                      <h4>Bild:</h4>
                    </v-col>
                    <v-col>
                      <img
                        class="elementImage"
                        :src="editElement.picturePath ? apiurl+'/file/'+editElement.picturePath : '../../assets/placeholder.png'"
                      >
                    </v-col>
                  </v-row>
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      cols="2"
                    >
                      <h4>Internet-Seite:</h4>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="editElement.webpage"
                        :placeholder="editElement.webpage"
                      />
                    </v-col>
                  </v-row>
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      cols="2"
                    >
                      <h4>Beschreibung:</h4>
                    </v-col>
                    <v-col>
                      <v-textarea
                        value="editElement.description"
                        :placeholder="editElement.description"
                        clearable
                        counter
                        no-resize
                        outlined
                        height="80"
                        background-color="grey lighten-4"
                      />
                    </v-col>
                  </v-row>
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      cols="2"
                    >
                      <h4>Adresse:</h4>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="editElement.address"
                        :placeholder="editElement.address"
                      />
                    </v-col>
                  </v-row>
                  <v-row gutters>
                    <v-col
                      class="mt-5"
                      cols="2"
                    >
                      <h4>Koordinaten:</h4>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="editElement.longitude"
                        label="longitude"
                        :placeholder="String(editElement.longitude)"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="editElement.latitude"
                        label="latitude"
                        :placeholder="String(editElement.latitude)"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions
              class="ma-0 pa-0"
            >
              <v-btn-toggle
                borderless
                style="width: 50%"
              >
                <v-btn
                  color="success"
                  block
                  tile
                  @click="changeInst()"
                >
                  Bestätigen
                </v-btn>
                <v-btn
                  color="error"
                  block
                  tile
                  @click="overlay = false"
                >
                  Schließen
                </v-btn>
              </v-btn-toggle>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import { userSession } from '../../userSession';

export default {
  name: 'InstitutionEditieren',
  data: () => ({
    items: [],
    gotResponse: false,
    apiurl: window.apiurl,
    overlay: false,
    editElement: null,
    alert: false,
    alertType: null,
    userFeedback: '',
  }),
  mounted() {
    // TODO: nur die Institutionen des Besitzers anzeigen
    this.load();
  },
  methods: {
    load() {
      axios.get('institutions')
        .then((res) => {
          this.items = res.data;
        })
        .catch((err) => {
          this.show(err.toString(), 'error');
        })
        .finally(() => {
          this.gotResponse = true;
          this.resultList = this.items;
        });
    },
    editClick(inst) {
      if (inst !== null && inst !== undefined) {
        if (typeof inst === 'object' && Object.keys(inst).length > 0) {
          this.editElement = JSON.parse(JSON.stringify(inst));
          this.overlay = true;
          return;
        }
      }
      this.showAlert('Institution konnte nicht ausgewählt werden', 'error');
    },
    changeInst() {
      if (userSession.isUserSignedIn() && this.editElement != null) {
        const headers = this.editElement;
        headers.authToken = userSession.loadUserData().authResponseToken;
        // TODO: Picture abhängig von Issue #83
        delete headers.picturePath;

        axios.patch('institutions', {}, { headers })
          .then(() => {
            this.load();
            this.showAlert('Das Ändern der Daten war erfolgreich', 'success');
          })
          .catch((err) => {
            this.showAlert(err.toString(), 'error');
          }).finally(() => {
            this.overlay = false;
          });
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

  .institution {
    display: flex;
    flex-direction: row;
    margin-bottom: 25px;
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
