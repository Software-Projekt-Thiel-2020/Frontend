<template>
  <v-container>
    <div class="gradientBackground">
      <div class="titleHeader text-center">
        <h1
          :class="$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-3'"
          class="font-weight-thin white--text"
        >
          Neues Projekt anlegen
        </h1>
      </div>
    </div>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="project.title"
          label="Projektname"
          outlined
          clearable
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          label="Link zur Website (optional)"
          outlined
          clearable
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-overflow-btn
          v-model="project.idInstitution"
          label="Institution (optional)"
          target="#dropdown-institution"
          :items="allInstitutionsSortedNameId"
          item-text="name"
          item-value="id"
          auto-select-first
          outlined
          clearable
        />
      </v-col>
      <v-col>
        <router-link
          to="/institution"
          tag="span"
        >
          <v-btn
            style="text-transform: none"
          >
            neue Institution erstellen
          </v-btn>
        </router-link>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="project.goal"
          type="number"
          min="1"
          oninput="validity.valid||(value='');"
          label="Spendenziel in Wei"
          outlined
          clearable
        />
      </v-col>
      <v-col cols="3">
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Projektende eingeben"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="date"
            :min="today"
            @input="afterDayInput"
          />
        </v-menu>
      </v-col>
      <v-col cols="3">
        <v-menu
          v-model="timeMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="time"
              :disabled="blockTime"
              label="Uhrzeit eingeben (GMT)"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-time-picker
            v-model="time"
            format="24hr"
            @input="afterTimeInput"
          />
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="project.milestones"
          sort-by="calories"
        >
          <template v-slot:top>
            <v-toolbar
              flat
              color="white"
            >
              <v-toolbar-title>Weitere Meilensteine</v-toolbar-title>
              <v-spacer />
              <v-dialog
                v-model="dialog2"
                max-width="400"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :disabled="blockAdditionalMilestones"
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    Neues Item
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Meilensteinname"
                            outlined
                            clearable
                            autofocus
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.goal"
                            label="Spendenziel in Wei"
                            type="number"
                            min="1"
                            oninput="validity.valid||(value='');"
                            outlined
                            clearable
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.requiredVotes"
                            label="Benötigte Stimmen"
                            type="number"
                            min="1"
                            oninput="validity.valid||(value='');"
                            outlined
                            clearable
                          />
                        </v-col>
                        <v-col>
                          <v-date-picker
                            v-model="editedItem.until"
                            :min="today"
                            :max="date"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="close"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-btn
        outlined
        color="black"
        @click="calcMainUntil()"
      >
        Spendenprojekt anlegen
      </v-btn>
    </v-row>
    <v-snackbar
      v-model="dialog.successful"
      bottom
      color="success"
    >
      Spendenprojekt erstellt!
    </v-snackbar>

    <v-snackbar
      v-model="dialog.error"
      bottom
      color="error"
    >
      Spendenprojekt konnte nicht erstellt werden: {{ dialog.errorMessage }}
    </v-snackbar>
    <v-snackbar
      v-model="dialog.notLoggedIn"
      top
      color="error"
    >
      Loggen Sie sich ein, um ein Spendenprojekt erstellen zu können
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import { userSession } from '../../userSession';


export default {
  name: 'ProjektAnlegen',
  data: () => ({
    blockTime: true,
    blockAdditionalMilestones: true,
    dialog: {
      notLoggedIn: false,
      successful: false,
      error: false,
      errorMessage: '',
    },
    dialog2: false,
    headers: [
      {
        text: 'Meilensteinname',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Spendenziel', value: 'goal' },
      { text: 'benötigte Stimmen', value: 'requiredVotes' },
      { text: 'Meilensteinende', value: 'until' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      goal: 1,
      requiredVotes: 1,
      until: null,
    },
    defaultItem: {
      name: '',
      goal: 1,
      requiredVotes: 1,
      until: null,
    },
    userSession: null,
    userData: null,
    error: false,
    dateMenu: false,
    timeMenu: false,
    date: '',
    today: '',
    time: '',
    allInstitutions: [],
    allInstitutionsSortedNameId: [],
    project: {
      title: '',
      website: '',
      idInstitution: null,
      requiredVotes: null,
      goal: 1,
      until: 0,
      milestones: [],
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Neuer Meilenstein' : 'Meilenstein bearbeiten';
    },
    watch: {
      dialog2(val) {
        // eslint-disable-next-line no-unused-expressions
        val || this.close();
      },
    },
  },
  created() {
    this.userSession = userSession;
  },
  mounted() {
    if (userSession.isUserSignedIn()) {
      this.userData = userSession.loadUserData();
    } else {
      this.dialog.notloggedIn = true;
    }
    this.getTodaysDate();
    this.getAllInstitutions();
  },
  methods: {
    afterDayInput() {
      this.dateMenu = false;
      this.blockTime = false;
    },
    afterTimeInput() {
      this.timeMenu = false;
      this.blockAdditionalMilestones = false;
      this.calcUntil();
    },
    editItem(item) {
      this.editedIndex = this.project.milestones.indexOf(item);
      this.editedItem = { ...item };
      this.dialog2 = true;
    },
    deleteItem(item) {
      const index = this.project.milestones.indexOf(item);
      this.project.milestones.splice(index, 1);
    },
    close() {
      this.dialog2 = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.project.milestones[this.editedIndex], this.editedItem);
      } else {
        this.project.milestones.push(this.editedItem);
      }
      this.close();
    },
    getTodaysDate() {
      this.today = new Date().toJSON().slice(0, 10);
    },
    getAllInstitutions() {
      axios.get('/institutions').then((res) => {
        this.allInstitutions = res.data;
        for (let i = 0; i < this.allInstitutions.length; i += 1) {
          this.allInstitutionsSortedNameId.push({ name: this.allInstitutions[i].name, id: this.allInstitutions[i].id });
        }
      });
    },
    calcMainUntil() {
      if (this.project.until !== 0) {
        this.createSpendenProjekt();
      }
    },
    calcUntil() {
      const dateArray = this.date.split(('-'), 3);
      const timeArray = this.time.split((':'), 2);
      this.project.until = Date.UTC(parseInt(dateArray[0], 10), parseInt(dateArray[1], 10), parseInt(dateArray[2], 10),
        parseInt(timeArray[0], 10), parseInt(timeArray[1], 10));
    },
    createSpendenProjekt() {
      const headers = {
        authToken: this.userData.authResponseToken,
        name: this.project.title,
        website: this.project.website,
        idInstitution: this.project.idInstitution,
        goal: this.project.goal,
        requiredVotes: this.project.requiredVotes,
        until: this.project.until,
        milestones: this.project.milestones,
      };
      axios.post('projects', {}, { headers })
        .then(() => {
          this.dialog.successful = true;
        })
        .catch((err) => {
          this.dialog.errorMessage = err.toString();
          this.dialog.error = true;
        });
    },
  },
};
</script>

<style scoped>
    .titleHeader {
        padding-bottom: 15px;
        padding-top: 10px;
        backdrop-filter: blur(15px) brightness(0.5);
    }
    .gradientBackground {
        background: linear-gradient(to right, rgb(199, 255, 212), rgb(176, 218, 255));
        background-color: rgb(255, 255, 255);
    }
</style>
