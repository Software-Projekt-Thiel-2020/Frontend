<template>
  <div class="gradientBackground">
    <div class="titleHeader text-center">
      <h1
        :class="$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-3'"
        class="font-weight-thin white--text"
      >
        Betriebsseite
      </h1>
    </div>
    <v-container>
      <v-row>
        <v-col cols="1" />
        <v-col cols="10">
          <v-card
            class="projectBox"
            elevation="4"
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="font-weight-light display-1">
                  {{ project[0].name }}
                </v-card-title>
                <v-card-text>
                  <div class="mb-4">
                    <h3>Adresse</h3>
                    {{ project[0].address }}
                  </div>
                </v-card-text>
                <v-card-actions>
                  <a :href="project[0].webpage">
                    <v-btn outlined>Webseite besuchen</v-btn>
                  </a>
                </v-card-actions>
              </div>
              <v-avatar
                class="ma-3"
                size="250"
                tile
              >
                <v-img :src="image" />
              </v-avatar>
            </div>
          </v-card>
        </v-col>
        <v-col cols="1" />
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
                  Läuft ab in:
                </h4>
                {{ voucher.validTime / 60 / 60 / 24 }} Tagen
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
              class="mt-2 btn-hover color-9"
              dark
              @click="buyVoucher(voucher.id)"
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
    userSession: null,
    userData: null,
    institutionId: null,
    project: [{
      name: '',
      webpage: '',
      address: '',
    }],
    image: 'https://i.imgur.com/EJOjIMC.jpg',
    vouchers: [],
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
    eurToEth: 0,
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
    this.szaboToEuro();
  },
  methods: {
    getETHValue(value) {
      if (value > 0) {
        return (value * this.eurToEth).toFixed(2);
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
        });
    },
    loadVouchers() {
      let url = 'vouchers/institution?idInstitution=';
      url += this.institutionId;
      axios.get(url)
        .then((res) => {
          this.vouchers = res.data;
        })
        .catch((err) => {
          this.dialogVoucher.errorMessage = err.toString();
          this.dialogVoucher.error = true;
        });
    },
    szaboToEuro() {
      axios.get('https://min-api.cryptocompare.com/data/price?fsym=EUR&tsyms=ETH')
        .then((res) => {
          this.exrate = (res.data.ETH * 1000000);
          this.eurToEth = res.data.ETH;
        })
        .catch((err) => {
          this.dialogEth.errorMessage = err.toString();
          this.dialogEth.error = true;
        });
    },
    buyVoucher(id) {
      if (this.userData == null) {
        this.notLoggedin = true;
      } else {
        const headers = {
          idVoucher: id,
          authToken: this.userData.authResponseToken,
        };
        axios.post('vouchers/user', { }, { headers })
          .then(() => {
            this.dialogBuyVoucher.successfull = true;
          })
          .catch((err) => {
            this.dialogBuyVoucher.errorMessage = err.toString();
            this.dialogBuyVoucher.error = true;
          });
      }
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
</style>
