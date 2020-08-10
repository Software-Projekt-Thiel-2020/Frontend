<template>
  <Default
    title="Willkommen"
    :subtitle="item.username"
    :loading="loading"
  >
    <v-row
      v-if="!errorMessage"
      class="text-center"
    >
      <v-col
        cols="12"
        sm="4"
      >
        <v-btn
          style="text-align:center"
          block
          to="/portfolio"
        >
          Meine Portfolio
        </v-btn>
      </v-col>
      <v-col
        cols="12"
        sm="4"
      >
        <v-btn
          style="text-align:center"
          block
          to="/InstitutionEditieren"
        >
          Meine Institutionen
        </v-btn>
      </v-col>
      <v-col
        cols="12"
        sm="4"
      >
        <v-btn
          style="text-align:center"
          block
          to="/ProjektEditieren"
        >
          Meine Projekte
        </v-btn>
      </v-col>
    </v-row>

    <v-row
      v-if="!errorMessage"
      class="text-center"
    >
      <v-col
        cols="12"
        sm="6"
        class="text-left"
      >
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
          :disabled="(!valid || !vForm)"
          color="success"
          class="mr-6 mb-6"
          :loading="processingChanges"
          width="12em"
          @click="submit"
        >
          bestätigen
        </v-btn>
        <v-btn
          color="error"
          width="12em"
          class="mr-6 mb-6"
          @click="reset"
        >
          zurücksetzten
        </v-btn>
      </v-col>
    </v-row>

    <v-alert
      v-else-if="errorMessage"
      type="error"
      class="ma-10"
    >
      {{ errorMessage }}
    </v-alert>
  </Default>
</template>

<script>
import axios from 'axios';
import EventBus from '@/utils/eventBus';
import { userSession } from '@/userSession';

import Default from '../Default.vue';

export default {
  name: 'BenutzerProfil',
  components: {
    Default,
  },
  data: () => ({
    loading: true,
    processingChanges: false,
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
  }),
  computed: {
    valid() {
      return this.newFirstname || this.newLastname || this.newEmail;
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
        this.processingChanges = true;
        axios.put('users', {}, { headers })
          .then(() => {
            EventBus.$emit('new-snackbar', 'Das Ändern ihrer Daten war erfolgreich', 'success', 10000, true);
            this.loadData();
            this.reset();
          })
          .catch((err) => {
            EventBus.$emit('new-snackbar', `Das Ändern ihrer Daten war NICHT erfolgreich!\n${err.toString()}`, 'error', 10000, true);
            this.errorMessage = err.toString();
          }).finally(() => {
            this.processingChanges = false;
          });
      }
    },
  },
};
</script>

<style scoped>
  .inputField ::placeholder{
    color: black!important;
    opacity: 1;
  }
</style>
