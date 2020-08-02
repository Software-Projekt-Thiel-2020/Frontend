<template>
  <div class="gradientBackground">
    <div
      v-if="project"
      class="titleHeader text-center"
    >
      <h1
        :class="$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-3'"
        class="font-weight-thin white--text"
      >
        {{ project.name }}
      </h1>
      <a
        class=""
        :href="'//'+project.webpage"
      >
        <v-btn
          outlined
          color="white"
        >Webseite besuchen</v-btn>
      </a>
    </div>
    <v-dialog
      v-model="loading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Anfrage wird bearbeitet...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog"
      :max-width="$vuetify.breakpoint.smAndDown ? '95vw':'50vw'"
    >
      <v-card class="text-center py-10">
        <svg
          class="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        ><circle
          class="checkmark__circle"
          cx="26"
          cy="26"
          r="25"
          fill="none"
        /><path
          class="checkmark__check"
          fill="none"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
        /></svg>
        <div class="donation_title">
          <v-icon
            class="mr-2 display-2"
            color="red"
          >
            mdi-cards-heart
          </v-icon>
          Deine Spende wurde verschickt!
          <v-icon
            class="ml-2 display-2"
            color="red"
          >
            mdi-cards-heart
          </v-icon>
        </div>
        <v-card-text class="title">
          Dein Betrag in Höhe von <b>{{ getDonationETHValue }} ETH</b> wurde gespendet.
        </v-card-text>


        <v-btn
          class="title"
          color="green darken-1"
          outlined
          @click="closeDialog"
        >
          OK
        </v-btn>
      </v-card>
    </v-dialog>
    <v-container v-if="project">
      <v-card
        v-if="project"
        elevation="7"
        class="py-6 text-center projectBox"
      >
        <v-card-text>
          <v-row justify="center">
            <v-col
              cols="12"
              style="max-width: 800px"
            >
              <v-card
                v-if="project"
                elevation="7"
                class="text-center"
              >
                <v-system-bar
                  color="secondary"
                  height="40px"
                >
                  <v-card-text
                    class="headline font-weight-thin"
                    style="color: white"
                  >
                    Meilensteine
                  </v-card-text>
                </v-system-bar>
                <div>
                  <div
                    v-for="milestone in project.milestones"
                    :key="milestone.id"
                  >
                    <v-row>
                      <v-col>
                        <h4 class="title">
                          Gesammelt
                        </h4>
                        <h1 class="title font-weight-light">
                          {{ showValue(milestone.totalDonated) }}
                        </h1>
                      </v-col>
                      <v-col>
                        <h4 class="title">
                          Ziel
                        </h4>
                        <h1 class="title font-weight-light">
                          {{ showValue(milestone.goal) }}
                        </h1>
                      </v-col>
                      <v-col>
                        <h4 class="title">
                          Votes
                        </h4>
                        <h1 class="title font-weight-light">
                          {{ milestone.currentVotes }} von {{ milestone.requiredVotes }} Stimmen
                        </h1>
                      </v-col>
                    </v-row>
                    <h3>{{ (milestone.totalDonated/milestone.goal) > 100 ? 100 : Math.round((milestone.totalDonated/milestone.goal) * 100 + Number.EPSILON) / 100 }}%</h3>
                    <v-progress-linear
                      color="secondary"
                      height="15"
                      :value="(milestone.totalDonated/milestone.goal)"
                      striped
                    />
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="py-8">
                <div>
                  <img
                    v-if="project.picturePath"
                    class="projectImage"
                    :src="apiurl+'/file/'+project.picturePath"
                  >
                  <img
                    v-else
                    class="projectImage"
                    src="../../assets/placeholder.png"
                  >
                  <h4 class="headline font-weight-light">
                    Jetzt Spenden!
                  </h4>
                  <currency-input
                    v-model="donationValue"
                    class="mt-3 headline"
                  />
                  <br>
                  <h1 class="display-1">
                    {{ getDonationETHValue ? getDonationETHValue : 0 }} ETH
                  </h1>
                  <v-checkbox
                    v-model="voteEnabled"
                    style="display:inline-flex"
                    class="text-center align-center"
                    label="Für Meilenstein abstimmen"
                  />
                  <br>
                  <v-btn
                    class="btn-hover color-9"
                    dark
                    @click="donate()"
                  >
                    Betrag Spenden
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
    <v-snackbar
      v-model="notLoggedin"
      top
      color="error"
    >
      Bitte melden Sie sich an
    </v-snackbar>
    <v-snackbar
      v-model="error"
      top
      color="error"
    >
      Spende konnte nicht getätigt werden: {{ errorMessage }}
    </v-snackbar>
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
    dialog: false,
    weiFormula: 1000000000000000000,
    errorMessage: null,
    error: false,
    loading: false,
    voteEnabled: true,
    apiurl: window.apiurl,
    notLoggedin: false,
  }),
  computed: {
    getDonationETHValue() {
      if (this.donationValue > 0) {
        return (this.donationValue * this.eurToEth).toFixed(8);
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
      // console.log(this.userData);
    }
    this.szaboToEuro();
    this.loadProject();
  },
  methods: {
    donate() {
      if (this.userData == null) {
        this.notLoggedin = true;
      } else {
        const donationAmount = this.getDonationETHValue * this.weiFormula;
        const headers = {
          authToken: this.userData.authResponseToken,
          idproject: this.projectid,
          amount: donationAmount,
          voteEnabled: this.voteEnabled ? 1 : 0,
        };
        this.userData = window.userSession.loadUserData();
        this.loading = true;
        axios.post('donations', {}, { headers })
          .then(() => {
            this.openDialog();
          })
          .catch((err) => {
            this.error = true;
            this.errorMessage = err.toString();
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    openDialog() {
      this.dialog = true;
      this.$confetti.start();
    },
    closeDialog() {
      this.dialog = false;
      this.$confetti.stop();
    },
    szaboToEuro() {
      this.loading = true;
      axios.get('https://min-api.cryptocompare.com/data/price?fsym=EUR&tsyms=ETH')
        .then((res) => {
          this.exrate = (res.data.ETH * 1000000000000000000);
          this.eurToEth = res.data.ETH;
          // console.log(this.exrate);
        })
        .catch((err) => {
          this.errorMessage = err.toString();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    loadProject() {
      let url = 'projects/';
      url += this.projectid;
      this.loading = true;
      axios.get(url)
        .then((res) => {
          // console.log(res.data);
          this.project = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.toString();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showValue(value) {
      if (value > 10e10) return `${(value / 10e18).toFixed(8)} ETH`;
      if (value > 10e6) return `${(value / 10e6)} MWEI`;
      return `${value} WEI`;
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
    min-height: 100%;
  }

  .projectBox{
    background-color: rgba(255, 255, 255, 0.8);
  }

  .projectImage{
    max-height: 200px;
    max-width: 200px;
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

  .donation_title{
    font-size: 2rem;
    vertical-align: text-bottom;
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

  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #7ac142;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    margin: 0px auto;
    border-top-left-radius: 50% !important;
    border-top-right-radius: 50% !important;
    box-shadow: inset 0px 0px 0px #7ac142;
    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }
  @keyframes scale {
    0%, 100% {
      transform: none;
    }
    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }
  @keyframes fill {
    100% {
      box-shadow: inset 0px 0px 0px 30px #7ac142;
    }
  }
</style>
