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
      <v-row v-if="errorMessage == null">
        <v-col
          sm="6"
          class="text-left pageBox"
        >
          <h2>Profildaten:</h2>
          <br>

          <v-form
            ref="form"
            v-model="newForm"
            lazy-validation
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
        </v-col>
      </v-row>
      <v-alert
        v-else
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
            <h1 style="text-align:center">
              Meine Spenden und Gutscheine
            </h1>
          </v-btn>
        </router-link>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BenutzerProfil',

  data: () => ({
    user: null,
    item: {
      username: 'username',
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email',
    },
    newForm: true,
    gotResponse: false,
    errorMessage: null,
    newEmail: '',
    newFirstname: '',
    newLastname: '',
    emailRules: [
      (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
    ],
  }),
  mounted() {
    axios.get(`users?username=${window.user.username}`)
      .then((res) => {
        if (res.data.length === 0) {
          throw Error('Could not fetch data');
        }
        this.item.username = res.data[0].username;
        this.item.firstname = res.data[0].firstname;
        this.item.lastname = res.data[0].lastname;
        this.item.email = res.data[0].email;
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
