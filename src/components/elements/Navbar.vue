<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = true"
      />
      <router-link
        to="/"
        tag="span"
        class="hidden-sm-and-down"
      >
        <v-btn
          class="d-flex align-center text-none"
          text
        >
          <h2>Spenderschlender</h2>
        </v-btn>
      </router-link>

      <router-link
        to="/"
        tag="span"
        class="hidden-sm-and-down"
      >
        <v-btn
          target="_blank"
          color="secondary"
          class="ma-2"
        >
          <span class="mr-2">Home</span>
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </router-link>

      <router-link
        to="/spenden"
        tag="span"
        class="hidden-sm-and-down"
      >
        <v-btn
          target="_blank"
          color="secondary"
          class="ma-2"
        >
          <span class="mr-2">Spenden</span>
          <v-icon>mdi-gift-outline</v-icon>
        </v-btn>
      </router-link>

      <router-link
        to="/gutscheine"
        tag="span"
        class="hidden-sm-and-down"
      >
        <v-btn
          target="_blank"
          color="secondary"
          class="ma-2"
        >
          <span class="mr-2">Gutscheine</span>
          <v-icon>mdi-wallet-outline</v-icon>
        </v-btn>
      </router-link>

      <router-link
        to="/ueberuns"
        tag="span"
        class="hidden-sm-and-down"
      >
        <v-btn
          target="_blank"
          color="secondary"
          class="ma-2"
        >
          <span class="mr-2">Über uns</span>
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </router-link>


      <v-spacer />

      <router-link
        to="/portfolio"
        tag="span"
        class="hidden-sm-and-down"
      >
        <v-btn
          v-if="userSession.isUserSignedIn()"
          target="_blank"
          color="accent"
          class="ma-2"
        >
          <span class="mr-2">Mein Portfolio</span>
          <v-icon>mdi-wallet</v-icon>
        </v-btn>
      </router-link>


      <v-btn
        v-if="!userSession.isUserSignedIn()"
        class="ma-2 hidden-sm-and-down"
        target="_blank"
        rounded
        color="accent"
        @click="signIn"
      >
        <span class="mr-2">Anmelden mit Blockstack</span>
        <img
          class="blockstack-logo"
          src="../../assets/blockstack.svg"
        >
      </v-btn>

      <v-menu
        v-if="userSession.isUserSignedIn()"
        bottom
        left
        :offset-y="true"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            dark
            icon
            class="hidden-sm-and-down"
            v-on="on"
          >
            <v-avatar color="white">
              <v-icon
                v-if="user && !user.avatarUrl()"
                color="indigo"
              >
                mdi-account-circle
              </v-icon>

              <img
                v-if="user && user.avatarUrl()"
                :src="user.avatarUrl()"
                alt="ProfilePicture"
              >
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <router-link
              to="/profil"
              tag="span"
            >
              <v-list-item-title class="clickable">
                <v-icon class="mr-1">
                  mdi-wrench
                </v-icon>Mein Profil
              </v-list-item-title>
            </router-link>
          </v-list-item>
          <v-list-item v-if="backend_userdata && backend_userdata.group === 'support'">
            <router-link
              to="/institution"
              tag="span"
            >
              <v-list-item-title class="clickable">
                <v-icon class="mr-1">
                  mdi-bank-plus
                </v-icon>Institution erstellen
              </v-list-item-title>
            </router-link>
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              class="clickable"
              @click="signOut"
            >
              <v-icon class="mr-1">
                mdi-logout
              </v-icon>Abmelden
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>


    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      style="position: fixed"
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          active-class="deep-purple--text text--accent-4"
        >
          <router-link
            to="/"
            tag="span"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link
            to="/spenden"
            tag="span"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-gift-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Spenden</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link
            to="/gutscheine"
            tag="span"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-wallet-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Gutscheine</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link
            to="/ueberuns"
            tag="span"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-information-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Über uns</v-list-item-title>
            </v-list-item>
          </router-link>

          <v-spacer />

          <router-link
            v-if="userSession.isUserSignedIn()"
            to="/portfolio"
            tag="span"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-wallet</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Mein Portfolio</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link
            v-if="userSession.isUserSignedIn()"
            to="/profil"
            tag="span"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-wrench</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Mein Profil</v-list-item-title>
            </v-list-item>
          </router-link>

          <v-list-item
            v-if="!userSession.isUserSignedIn()"
            color="accent"
            @click="signIn"
          >
            <v-list-item-icon>
              <v-icon>mdi-run</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Anmelden</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="userSession.isUserSignedIn()"
            color="accent"
            @click="signOut"
          >
            <v-list-item-icon>
              <v-icon>mdi-run</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Abmelden</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-dialog
      v-if="user && (gotResponse && !error) && (!register_dialog.successful) && (!backend_userdata)"
      v-model="register_dialog.show_dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-form
          ref="register_form"
          v-model="register_dialog.valid"
        >
          <v-card-title>
            <span class="headline">Registrierung abschließen</span>
            <v-alert
              v-if="register_dialog.errorMessage"
              :value="true"
              type="error"
              class="mt-4"
              style="width: 100%"
              prominent
            >
              Beim Senden der Daten ist ein Fehler aufgetreten:<br> {{ register_dialog.errorMessage }}
            </v-alert>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-text-field
                    v-model="register_dialog.firstname"
                    label="Vorname*"
                    required
                    :rules="register_dialog.nameRules"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-text-field
                    v-model="register_dialog.lastname"
                    label="Nachname*"
                    required
                    :rules="register_dialog.nameRules"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="register_dialog.email"
                    label="Email*"
                    required
                    :rules="emailConfirmationRules()"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="register_dialog.email2"
                    label="Email wiederholen*"
                    required
                    :rules="emailConfirmationRules()"
                  />
                </v-col>
              </v-row>
            </v-container>
            <small>* erforderliches Feld</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              :disabled="!register_dialog.valid"
              @click="register"
            >
              Speichern
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="register_dialog.successful"
      top
      color="success"
    >
      Registrierung abgeschlossen!
    </v-snackbar>

    <v-snackbar
      :value="error"
      top
      color="error"
      :timeout="0"
    >
      Konnte Benutzerdaten nicht laden: {{ errorMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import * as blockstack from 'blockstack';
import axios from 'axios';
import { userSession } from '../../userSession';

export default {
  name: 'Navbar',
  data: () => ({
    drawer: false,
    userSession: null,
    user: null,
    backend_userdata: null,
    gotResponse: false,
    errorMessage: null,
    error: false,
    register_dialog: {
      show_dialog: true,
      lastname: '',
      firstname: '',
      email: '',
      email2: '',
      valid: true,
      nameRules: [
        (v) => v.length > 2 || 'Name ist erforderlich',
      ],
      errorMessage: null,
      successful: false,
    },
  }),
  created() {
    this.userSession = userSession;
  },
  mounted() {
    if (userSession.isUserSignedIn()) {
      this.userData = userSession.loadUserData();
      this.user = new blockstack.Person(this.userData.profile);
      this.user.username = this.userData.username;
      window.user = this.user;

      this.get_user();
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn()
        .then(() => {
          window.location = window.location.origin;
        });
    }

    setInterval(() => {
      if (this.$refs.register_form) {
        this.$refs.register_form.validate();
      }
    }, 250);
  },
  methods: {
    signIn() {
      blockstack.redirectToSignIn();
    },
    signOut() {
      window.user = undefined;
      blockstack.signUserOut(window.location.origin);
    },

    emailConfirmationRules() {
      return [
        () => (this.register_dialog.email === this.register_dialog.email2) || 'E-mails müssen identisch sein',
        (v) => !!v || 'E-mail ist erforderlich',
        (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'keine valide E-Mail',
      ];
    },

    get_user() {
      axios.get(`users?username=${this.user.username}`)
        .then((res) => {
          if (res.data.length === 2) {
            this.backend_userdata = false;
          } else {
            [this.backend_userdata] = res.data;
          }
        })
        .catch((err) => {
          this.errorMessage = err.toString();
          this.error = true;
        })
        .finally(() => {
          this.gotResponse = true;
        });
    },

    register() {
      const headers = {
        authToken: this.userData.authResponseToken,
        username: this.user.username,
        firstname: this.register_dialog.firstname,
        lastname: this.register_dialog.lastname,
        email: this.register_dialog.email,
      };

      axios.post('users', {}, { headers })
        .then(() => {
          this.register_dialog.successful = true;
          this.get_user();
        })
        .catch((err) => {
          this.register_dialog.errorMessage = err.toString();
        });
    },
  },
};
</script>

<style scoped>
    .blockstack-logo{
      color: white;
      width: 24px;
    }

    .clickable {
        cursor: pointer
    }
</style>
