<template>
  <div>
    <v-container class="title">
      <h1>Institution erstellen</h1>
    </v-container>
    <v-container>
      <form class="inputData">
        <v-row>
          <v-col cols="3" />
          <v-col cols="6">
            <v-text-field
              v-model="name"
              outlined
              required
              autofocus
              label="Name"
            />
          </v-col>
          <v-col cols="3" />
        </v-row>
        <v-row>
          <v-col cols="3" />
          <v-col cols="6">
            <v-text-field
              v-model="address"
              outlined
              required
              autofocus
              label="Adresse"
            />
          </v-col>
          <v-col cols="3" />
        </v-row>
        <v-row>
          <v-col cols="3" />
          <v-col cols="6">
            <v-text-field
              v-model="website"
              outlined
              required
              label="Website"
            />
          </v-col>
          <v-col cols="3" />
        </v-row>
        <v-row>
          <v-col cols="4" />
          <v-col cols="4">
            <v-btn
              type="submit"
              block
              @click="createInstitution"
            >
              Institution erstellen
            </v-btn>
          </v-col>
          <v-col cols="4" />
        </v-row>
      </form>
    </v-container>
    <v-snackbar
      v-model="dialog.successful"
      top
      color="success"
    >
      Institution erstellt!
    </v-snackbar>

    <v-snackbar
      v-model="dialog.error"
      top
      color="error"
    >
      Institution konnte nicht erstellt werden: {{ dialog.errorMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios';
import { userSession } from '../../userSession';

export default {
  name: 'Institution',
  data: () => ({
    userSession: null,
    userData: null,
    name: '',
    website: '',
    address: '',
    dialog: {
      successful: false,
      error: false,
      errorMessage: '',
    },
  }),
  created() {
    this.userSession = userSession;
  },
  mounted() {
    if (userSession.isUserSignedIn()) {
      this.userData = userSession.loadUserData();
    }
  },
  methods: {
    createInstitution() {
      const headers = {
        authToken: this.userData.authResponseToken,
        name: this.name,
        address: this.address,
        webpage: this.website,
      };
      axios.post('institutions', { }, { headers })
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
.inputData {
    margin-top: 75px;
}
.title {
    text-align:center;
}
</style>
