<template>
  <div class="gradientBackground">
    <div class="titleHeader text-center">
      <h1
        :class="$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-3'"
        class="font-weight-thin white--text"
      >
        Spendenseite
      </h1>
    </div>
    <v-dialog
            v-model="dialog"
            max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Use Google's location service?</v-card-title>

        <v-card-text>
          Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
                  color="green darken-1"
                  text
                  @click="dialog = false"
          >
            Okidoke
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container v-if="project">
      <v-row>
        <v-col>
          <v-card
            v-if="project"
            class="projectBox"
            elevation="4"
          >
            <v-card-title class="font-weight-light display-1">
              {{ project.name }}
            </v-card-title>
            <v-card-text>
              <div class="mb-4">
                <h3>Adresse</h3>
                {{ project }}<br>
                {{ project.zip }} {{ project.city }}
              </div>
              <v-card
                elevation="7"
                class="py-6 text-center"
              >
                <div
                        v-for="milestone in project.milestones"
                        v-bind:key="milestone.id">
                  <v-row
                  >
                    <v-col>
                      <h4 class="headline">
                        Gesammelt
                      </h4>
                      <h1 class="display-1 font-weight-thin">
                        {{ (milestone.currentVotes/milestone.requiredVotes).toFixed(2) }} Stimmen
                      </h1>
                    </v-col>
                    <v-col>
                      <h4 class="headline">
                        Ziel
                      </h4>
                      <h1 class="display-1 font-weight-thin">
                        {{ milestone.requiredVotes }} Stimmen
                      </h1>
                    </v-col>
                  </v-row>
                  <h2>{{ (milestone.currentVotes/milestone.requiredVotes).toFixed(1)}}%</h2>
                  <v-progress-linear
                          color="secondary"
                          height="15"
                          :value="(milestone.currentVotes/milestone.requiredVotes)"
                          striped
                  />

                </div>
                <br>
                <hr>
                <currency-input
                  v-model="donationValue"
                  class="mt-3 headline"
                />
                <br>
                <h1 class="display-1">
                  {{ (getDonationETHValue) }} ETH
                </h1>
                <br>
                <v-btn
                  class="mt-2 btn-hover color-9"
                  dark
                  @click="donate()"
                >
                  Betrag Spenden
                </v-btn>
              </v-card>
            </v-card-text>
            <v-card-actions>
              <a :href="project.homepage">
                <v-btn outlined>Webseite besuchen</v-btn>
              </a>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-img :src="project.image" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Project',
  data: () => ({
    project: undefined,
    projectid: 0,
    exrate: 0,
    eurToEth: 0,
    donationValue: 0,
    goalPercentage: 0,
    dialog: true,
  }),
  computed: {
    getDonationETHValue() {
      if (this.donationValue > 0) {
        return (this.donationValue * this.eurToEth).toFixed(4);
      }
      return null;
    },

  },
  created() {
    this.projectid = this.$route.params.id;
  },
  mounted() {
    if (window.userSession.isUserSignedIn()) {
      this.userData = window.userSession.loadUserData();
      console.log(this.userData);
    }
    this.szaboToEuro();
    this.loadProject();
  },
  methods: {
    donate() {
      console.log('test');
      const headers = {
        authToken: this.userData.authResponseToken,
        idmilestone: 1,
        amount: (this.donationValue * this.exrate),
        voteEnabled: 1,

      };
      this.userData = window.userSession.loadUserData();
      axios.post('donations', {}, { headers })
        .then(() => {
        })
        .catch((err) => {
          this.errorMessage = err.toString();
        })
        .finally(() => {
          this.gotResponse = true;
        });
    },
    szaboToEuro() {
      axios.get('https://min-api.cryptocompare.com/data/price?fsym=EUR&tsyms=ETH')
        .then((res) => {
          this.exrate = (res.data.ETH * 1000000000000000000);
          this.eurToEth = res.data.ETH;
          console.log(this.exrate);
        })
        .catch((err) => {
          this.errorMessage = err.toString();
        })
        .finally(() => {
          this.gotResponse = true;
        });
    },
    loadProject() {
      let url = 'projects/';
      url += this.projectid;
      axios.get(url)
        .then((res) => {
          console.log(res.data);
          this.project = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.toString();
        })
        .finally(() => {
          this.gotResponse = true;
        });
    },
    start() {
      this.$confetti.start();
    },

    stop() {
      this.$confetti.stop();
    },

    love() {
      this.$confetti.update({
        particles: [
          {
            type: 'heart',
          },
          {
            type: 'circle',
          },
        ],
        defaultColors: [
          'red',
          'pink',
          '#ba0000',
        ],
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

  .projectBox {
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.8);

  }

  .goalBox {
    border: 1px dotted black;
  }


  a {
    text-decoration: none;
  }

  input {
    border: 1px lightgrey solid;
    text-align: center;
    border-radius: 50px;
  }


  .btn-hover {
    background-size: 300% 100%;
    border-radius: 50px;
    text-shadow: rgba(0, 0, 0, 0.7) 0px 0px 5px;
    transition: all .4s ease-in-out;
  }

  .btn-hover:hover {
    background-position: 100% 0;
    transition: all .4s ease-in-out;
  }

  .btn-hover.color-9 {
    background-image: linear-gradient(to right, #1ae14f, #3f86ed, #04befe, #12cd44);
    box-shadow: 0 4px 15px 0 rgba(65, 132, 234, 0.75);
  }
</style>
