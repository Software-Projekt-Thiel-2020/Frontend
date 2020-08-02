<template>
  <div class="gradientBackground">
    <v-dialog
      v-if="boughtVoucher "
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
          Gutschein erworben!
          <v-icon
            class="ml-2 display-2"
            color="red"
          >
            mdi-cards-heart
          </v-icon>
        </div>
        <v-card-text class="title">
          <v-card
            color="primary"
            dark
          >
            <v-card-title>{{ boughtVoucher.title }}</v-card-title>
            <v-card-subtitle class="overline text-left">
              {{ boughtVoucher.subject }}
            </v-card-subtitle>
            <v-card-actions>
              Gültigkeit: {{ boughtVoucher.validTime / 60 / 60 / 24 / 365 }} Jahre
              <v-spacer />
              <h3 class="pricetag font-weight-light">
                {{ showValue(boughtVoucher.price) }}
              </h3>
            </v-card-actions>
          </v-card>
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
    <v-container>
      <v-row>
        <v-col>
          <v-card
            class="projectBox"
            elevation="4"
          >
            <v-layout
              v-if="loadingProject == true"
              justify-center
            >
              <v-progress-circular
                :size="50"
                :width="7"
                color="green"
                indeterminate
              />
            </v-layout>
            <div
              v-else
              class="d-flex flex-no-wrap justify-space-between"
            >
              <div>
                <v-card-title class="font-weight-light display-1">
                  Infos über den Betrieb
                </v-card-title>
                <v-card-text>
                  <p class="institutionName">
                    Name: {{ project[0].name }}
                  </p>
                  <div class="mb-4">
                    <p>
                      Adresse: {{ project[0].address }}
                    </p>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <a :href="'//'+project[0].webpage">
                    <v-btn outlined>Webseite besuchen</v-btn>
                  </a>
                </v-card-actions>
              </div>
              <v-avatar
                class="ma-3"
                size="250"
                tile
              >
                <img
                  v-if="project[0].picturePath"
                  :src="apiurl+'/file/'+project[0].picturePath"
                >
                <img
                  v-else
                  src="../../assets/placeholder.png"
                >
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="titleHeader text-center">
          <h1
            :class="$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-3'"
            class="font-weight-thin white--text text-center"
          >
            Verfügbare Gutscheine
          </h1>
        </v-col>
      </v-row>
      <v-layout
        v-if="loadingVouchers == true"
        justify-center
      >
        <v-progress-circular
          :size="70"
          :width="7"
          color="green"
          indeterminate
        />
      </v-layout>
      <div v-else>
        <v-row>
          <v-col
            v-for="voucher in vouchers"
            :key="voucher.id"
            cols="6"
          >
            <v-card
              elevation="7"
              class="py-6 text-center"
            >
              <v-row>
                <v-col>
                  <h3 class="headline">
                    {{ voucher.title }}
                  </h3>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="voucherData">
                  <h4>
                    Beschreibung:
                  </h4>
                  {{ voucher.subject }}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="voucherData">
                  <h4>
                    Preis:
                  </h4>
                  {{ getETHValue(voucher.price) }}€
                </v-col>
                <v-col class="voucherData">
                  <h4>
                    Gültigkeit:
                  </h4>
                  {{ voucher.validTime / 60 / 60 / 24 / 365 }} Jahre
                </v-col>
              </v-row>
              <v-row>
                <v-col class="voucherData">
                  <h5>
                    Wurde bereits {{ voucher.amount }} mal gekauft
                  </h5>
                </v-col>
              </v-row>
              <v-btn
                :id="voucher.id"
                class="mt-2 btn-hover color-9"
                dark
                :loading="loading && indexClicked == voucher.id"
                @click="buyVoucher(voucher)"
              >
                Gutschein kaufen
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="vouchers.length==0">
          <v-col class="noVouchers">
            <h3>
              Keine Gutscheine vorhanden
            </h3>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <v-snackbar
      v-model="dialogVoucher.error"
      top
      color="error"
    >
      Gutscheine konnten nicht geladen werden {{ dialogVoucher.errorMessage }}
    </v-snackbar>
    <v-snackbar
      v-model="dialogProject.error"
      top
      color="error"
    >
      Institution konnten nicht geladen werden {{ dialogProject.errorMessage }}
    </v-snackbar>
    <v-snackbar
      v-model="dialogEth.error"
      top
      color="error"
    >
      Etherum Wechselkurs konnte nicht geladen werden {{ dialogEth.errorMessage }}
    </v-snackbar>
    <v-snackbar
      v-model="dialogBuyVoucher.error"
      top
      color="error"
    >
      Gutschein konnte nicht gekauft werden {{ dialogVoucher.errorMessage }}
    </v-snackbar>
    <v-snackbar
      v-model="dialogBuyVoucher.successfull"
      top
      color="success"
    >
      Gutschein gekauft
    </v-snackbar>
    <v-snackbar
      v-model="notLoggedin"
      top
      color="error"
    >
      Bitte melden Sie sich an
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios';
import { userSession } from '../../userSession';

export default {
  name: 'ProjectGutschein',
  data: () => ({
    apiurl: window.apiurl,
    userSession: null,
    userData: null,
    institutionId: null,
    dialog: false,
    project: [{
      name: '',
      webpage: '',
      address: '',
    }],
    image: 'https://i.imgur.com/EJOjIMC.jpg',
    vouchers: [],
    loadingVouchers: true,
    loadingProject: true,
    dialogVoucher: {
      errorMessage: '',
      error: false,
    },
    dialogProject: {
      errorMessage: '',
      error: false,
    },
    dialogBuyVoucher: {
      errorMessage: '',
      error: false,
      successfull: false,
    },
    dialogEth: {
      errorMessage: '',
      error: false,
    },
    notLoggedin: false,
    exrate: 0,
    ethToEur: 0,
    loading: false,
    indexClicked: null,
    boughtVoucher: null,
  }),
  created() {
    this.userSession = userSession;
    this.institutionId = this.$route.params.id;
  },
  mounted() {
    this.loadInstitution();
    this.loadVouchers();
    if (userSession.isUserSignedIn()) {
      this.userData = userSession.loadUserData();
    }
    this.weiToEuro();
  },
  methods: {
    getETHValue(value) {
      if (value > 0) {
        return (value * this.ethToEur).toFixed(4);
      }
      return null;
    },
    loadInstitution() {
      let url = 'institutions?id=';
      url += this.institutionId;
      axios.get(url)
        .then((res) => {
          this.project = res.data;
        })
        .catch((err) => {
          this.dialogProject.errorMessage = err.toString();
          this.dialogProject.error = true;
        }).finally(() => {
          this.loadingProject = false;
        });
    },
    loadVouchers() {
      let url = 'vouchers/institution?idInstitution=';
      url += this.institutionId;
      url += '&available=1';
      axios.get(url)
        .then((res) => {
          this.vouchers = res.data;
        })
        .catch((err) => {
          this.dialogVoucher.errorMessage = err.toString();
          this.dialogVoucher.error = true;
        }).finally(() => {
          this.loadingVouchers = false;
        });
    },
    weiToEuro() {
      axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR')
        .then((res) => {
          this.ethToEur = res.data.EUR / 1000000000000000000;
        })
        .catch((err) => {
          this.dialogEth.errorMessage = err.toString();
          this.dialogEth.error = true;
        });
    },
    buyVoucher(voucher) {
      if (this.userData == null) {
        this.notLoggedin = true;
      } else {
        const headers = {
          idVoucher: voucher.id,
          authToken: this.userData.authResponseToken,
        };
        this.loading = true;
        this.indexClicked = voucher.id;
        axios.post('vouchers/user', { }, { headers })
          .then(() => {
            this.boughtVoucher = voucher;
            this.openDialog();
          })
          .catch((err) => {
            this.dialogBuyVoucher.errorMessage = err.toString();
            this.dialogBuyVoucher.error = true;
          }).finally(() => {
            this.loading = false;
          });
      }
    },
    showValue(value) {
      if (value > 10e10) return `${(value / 10e18).toFixed(8)} ETH`;
      if (value > 10e6) return `${(value / 10e6)} MWEI`;
      return `${value} WEI`;
    },
    openDialog() {
      this.dialog = true;
      this.$confetti.start();
    },
    closeDialog() {
      this.dialog = false;
      this.$confetti.stop();
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

    .voucherData {
      text-align: left;
      margin-left: 25px;
    }

    .voucherData h5 {
      font-style: italic;
    }

    .noVouchers {
      text-align: center;
      color: red;
    }

    .institutionName {
      font-size: 20px;
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

    .donation_title{
      font-size: 2rem;
      vertical-align: text-bottom;
    }
</style>
