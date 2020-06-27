<template>
  <div>
    <v-parallax
      dark
      :height="400"
      src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          class="text-center"
        >
          <h1 class="display-2 font-weight-thin">
            Mein Portfolio
          </h1>
        </v-col>
        <v-col>
          <v-card
            color="primary"
            class="wallet"
            dark
          >
            <v-toolbar
              color="indigo"
              dark
            >
              <v-spacer />

              <v-toolbar-title>
                <v-icon
                  class="display-1"
                  style="color: white"
                >
                  mdi-wallet
                </v-icon>
                Mein Wallet
              </v-toolbar-title>
              <v-spacer />
            </v-toolbar>

            <!-- TODO: Wallet laden -->
            <div class="ma-5 pb-1">
              <h4>
                Meine persönliche Wallet Adresse:
                <v-chip>
                  <span class="walletAddress">
                    {{ wallet.adress }}
                  </span>
                </v-chip>
              </h4>
              <span class="caption font-italic">
                Guthaben können Sie aufladen, indem Sie Ethereum an ihre Wallet Adresse senden.
              </span>
              <v-divider class="my-3" />
              <div class="text-right">
                <v-chip
                  class="px-3 py-6"
                  color="primary"
                >
                  <v-icon class="display-1">
                    mdi-ethereum
                  </v-icon>
                  <h3 class="display-1 font-weight-light">
                    {{ wallet.amount }}ETH
                  </h3>
                </v-chip>
              </div>
              <span class="" />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-parallax>
    <v-container>
      <v-row>
        <v-col>
          <v-card color="primary">
            <v-toolbar
              color="indigo"
              dark
            >
              <v-spacer />

              <v-toolbar-title>
                <v-icon
                  class="display-1"
                  style="color: white"
                >
                  mdi-wallet-giftcard
                </v-icon>
                Meine Gutscheine
              </v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-tabs
              v-model="tab"
              fixed-tabs
              background-color="indigo"
              slider-color="secondary"
              dark
            >
              <v-tab>
                <v-chip
                  color="secondary"
                  class="v-chip--clickable"
                >
                  <v-avatar
                    v-if="gotResponse === true"
                    left
                    color="primary"
                  >
                    {{ getVouchers(false).length }}
                  </v-avatar>
                  <v-avatar
                    v-else
                    left
                    color="primary"
                  >
                    0
                  </v-avatar>
                  Gültig
                </v-chip>
              </v-tab>
              <v-tab>
                <v-chip
                  color="secondary"
                  class="v-chip--clickable"
                >
                  <v-avatar
                    v-if="gotResponse === true"
                    left
                    color="primary"
                  >
                    {{ getVouchers(true).length }}
                  </v-avatar>
                  <v-avatar
                    v-else
                    left
                    color="primary"
                  >
                    0
                  </v-avatar>
                  Eingelöst
                </v-chip>
              </v-tab>
            </v-tabs>
            <v-card-text
              v-if="vErrMsg.length !== 0"
              class="text-center"
            >
              <h1 class="my-10">
                {{ vErrMsg }}
              </h1>
            </v-card-text>
            <v-card-text
              v-else-if="vouchers === null"
              class="text-center"
            >
              <h1 class="my-10">
                Keine Gutscheine vorhanden
              </h1>
            </v-card-text>
            <v-row
              v-else
              class="ma-2"
            >
              <v-col
                v-for="voucher in getVouchers(tab)"
                :key="voucher.id"
                cols="12"
              >
                <v-card :color="voucher.used ? '#dddddd' : 'white'">
                  <v-card-title>{{ voucher.titel }}</v-card-title>
                  <v-card-subtitle class="overline">
                    {{ voucher.titel }}
                  </v-card-subtitle>
                  <v-card-text>{{ voucher.description }}</v-card-text>
                  <v-card-actions>
                    <v-btn
                      v-if="!voucher.used"
                      color="success"
                    >
                      Einlösen
                    </v-btn>
                    <v-btn
                      v-if="voucher.used"
                      disabled
                      outlined
                    >
                      Eingelöst
                    </v-btn>
                    <v-spacer />
                    <h3 class="pricetag font-weight-light">
                      {{ voucher.price }} ETH
                    </h3>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col>
          <v-card color="primary">
            <v-toolbar
              color="indigo"
              dark
            >
              <v-spacer />
              <v-toolbar-title>
                <v-icon
                  class="display-1"
                  style="color: white"
                >
                  mdi-heart
                </v-icon>
                Meine Spenden
              </v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text
              v-if="dErrMsg.length !== 0"
              class="text-center"
            >
              <h1 class="my-10">
                {{ dErrMsg }}
              </h1>
            </v-card-text>
            <v-card-text
              v-else-if="donations === null"
              class="text-center"
            >
              <h1 class="my-10">
                Keine Spenden getätigt
              </h1>
            </v-card-text>
            <v-row
              v-else
              class="ma-2"
            >
              <v-col
                v-for="donation in donations"
                :key="donation.id"
                cols="12"
              >
                <v-card>
                  <v-card-title>{{ donation.projectname }}</v-card-title>
                  <v-card-subtitle class="overline">
                    {{ donation.projectname }}
                  </v-card-subtitle>
                  <v-card-text>{{ donation.projectname }}</v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <h3 class="pricetag font-weight-light">
                      {{ donation.amount }} ETH
                    </h3>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Historie',
  data: () => ({
    tab: null,
    wallet: {
      adress: '0x1D1479C185d32EB90533a08b36B3CFa5F84A0E6B',
      amount: '1337.5012',
    },
    donations: null,
    vouchers: null,
    errorMessage: '',
    vErrMsg: '',
    dErrMsg: '',
    gotResponse: false,
  }),
  mounted() {
    axios.get(`users?username=${window.user.username}`)
      .then((res) => {
        if (res.data.length === 0) {
          this.errorMessage = 'Could not fetch data';
        } else {
          this.userid = res.data[0].id;

          // TODO: REMOVE HARDCODED UID
          this.userid = 1;

          this.donations = this.loadDonations();
          this.vouchers = this.loadVouchers();
        }
      }).catch((err) => {
        this.errorMessage = err.toString();
      }).finally(() => {
        this.gotResponse = true;
      });
  },
  methods: {
    getVouchers(used) {
      if (this.vouchers === null || this.vouchers === undefined) {
        return [];
      }
      if (used === true) {
        return this.vouchers.filter((voucher) => voucher.used);
      }
      return this.vouchers.filter((voucher) => !voucher.used);
    },
    loadVouchers() {
      axios.get(`vouchers/user?idUser=${this.userid}`)
        .then((res) => {
          this.vouchers = res.data;
          if (res.data.length === 0) {
            this.vErrMsg = 'Could not fetch data';
          }
        }).catch((err) => {
          this.vErrMsg = err.toString();
        });
    },
    loadDonations() {
      axios.get(`donations?iduser=${this.userid}`)
        .then((res) => {
          this.donations = res.data;
          if (res.data.length === 0) {
            this.dErrMsg = 'Could not fetch data';
          }
        }).catch((err) => {
          this.dErrMsg = err.toString();
        });
    },
  },
};
</script>

<style scoped>
  .pricetag {
    font-size: 1.5rem;
  }

  .walletAddress {
    font-family: Courier;
  }

  .wallet {
    max-width: 500px;
  }
</style>
