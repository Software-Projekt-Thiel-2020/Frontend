<template>
  <div
    class="ma-5"
  >
    <v-container>
      <div>
        <h1 class="display-2">
          Willkommen!
        </h1>
        <p
          v-if="errorMessage == null"
          class="display-2 overline"
        >
          ({{ item.username }})
        </p>
      </div>
      <v-layout
        v-if="loading == true"
        justify-center
      >
        <v-progress-circular
          :size="70"
          :width="7"
          color="green"
          indeterminate
        />
      </v-layout>
      <v-row v-if="!errorMessage && loading == false">
        <v-col
          sm="6"
          class="text-left pageBox"
        >
          <h2>Profildaten:</h2>
          <br>

          <v-form
            ref="form"
            v-model="vForm"
          >
            <v-row no-gutters>
              <v-col>
                <h4 class="mt-5">
                  Vorname:
                </h4>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="newFirstname"
                  class="inputField"
                  :placeholder="item.firstname"
                />
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col>
                <h4 class="mt-5">
                  Nachname:
                </h4>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="newLastname"
                  class="inputField"
                  :placeholder="item.lastname"
                />
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col>
                <h4 class="mt-5">
                  E-Mail:
                </h4>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="newEmail"
                  class="inputField"
                  :rules="emailRules"
                  :placeholder="item.email"
                />
              </v-col>
            </v-row>
          </v-form>
          <v-btn
            color="error"
            class="mr-4 mt-4"
            @click="reset"
          >
            Änderungen zurücksetzten
          </v-btn>
          <v-btn
            :disabled="(!valid || !vForm)"
            color="success"
            class="mt-4"
            @click="submit"
          >
            Änderungen bestätigen
          </v-btn>
          <v-snackbar
            v-model="snackbar"
            multi-line
            :color="snackbarType"
            centered
            :timeout="0"
          >
            {{ userFeedback }}
            <v-btn
              color="white"
              text
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </v-snackbar>
        </v-col>
      </v-row>
      <v-alert
        v-else-if="errorMessage"
        type="error"
        class="ma-10"
      >
        {{ errorMessage }}
      </v-alert>
      <div class="linkToDonate mx-auto text-center ma-2 mt-10">
        <router-link
          to="/portfolio"
          tag="span"
          class="link"
        >
          <v-btn>
            <h1
              class="display-1 font-weight-regular"
              style="text-align:center"
            >
              Meine Spenden und Gutscheine
            </h1>
          </v-btn>
        </router-link>
      </div>
      <div class="linkToDonate mx-auto text-center ma-2 mt-10">
        <router-link
          to="/InstitutionEditieren"
          tag="span"
          class="link"
        >
          <v-btn class="mt-5">
            <h1
              class="display-1 font-weight-regular"
              style="text-align:center"
            >
              Meine Institutionen
            </h1>
          </v-btn>
        </router-link>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import { userSession } from '../../userSession';

export default {
  name: 'BenutzerProfil',

  data: () => ({
    loading: true,
    item: {
      username: 'username',
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email',
    },
    vForm: true,
    gotResponse: false,
    errorMessage: null,
    newEmail: '',
    newFirstname: '',
    newLastname: '',
    emailRules: [
      (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || (v === ''),
    ],
    snackbar: false,
    userFeedback: '',
    snackbarType: null,
  }),
  computed: {
    valid() {
      if (this.newFirstname || this.newLastname || this.newEmail) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      axios.get(`users?username=${window.user.username}`)
        .then((res) => {
          if (res.data.length === 0) {
            this.errorMessage = 'Could not fetch data';
          } else {
            this.item.username = res.data[0].username;
            this.item.firstname = res.data[0].firstname;
            this.item.lastname = res.data[0].lastname;
            this.item.email = res.data[0].email;
          }
        })
        .catch((err) => {
          this.errorMessage = err.toString();
        })
        .finally(() => {
          this.gotResponse = true;
          this.loading = false;
        });
    },
    reset() {
      this.newFirstname = '';
      this.newLastname = '';
      this.newEmail = '';
    },

    submit() {
      if (userSession.isUserSignedIn()) {
        const headers = {
          authToken: userSession.loadUserData().authResponseToken,
        };
        if (this.newFirstname) {
          headers.firstname = this.newFirstname;
        } else {
          headers.firstname = this.item.firstname;
        }
        if (this.newLastname) {
          headers.lastname = this.newLastname;
        } else {
          headers.lastname = this.item.lastname;
        }
        if (this.newEmail) {
          headers.email = this.newEmail;
        } else {
          headers.email = this.item.email;
        }

        axios.put('users', {}, { headers })
          .then(() => {
            this.snackSucc();
            this.loadData();
            this.reset();
          })
          .catch((err) => {
            this.snackErr();
            this.errorMessage = err.toString();
          });
      }
    },
    snackSucc() {
      this.snackbar = true;
      this.snackbarType = 'success';
      this.userFeedback = 'Das Ändern ihrer Daten war erfolgreich';
    },
    snackErr() {
      this.snackbar = true;
      this.snackbarType = 'error';
      this.userFeedback = 'Das Ändern ihrer Daten war NICHT erfolgreich!';
    },


  },
};
</script>

<style scoped>

    .inputField ::placeholder{
        color: black!important;
        opacity: 1;
    }

  .pageBox{
    position:relative;
    width: 100%;
  }

  .linkToDonate {
      width: 100%;
      bottom: 40px;
  }
</style>
