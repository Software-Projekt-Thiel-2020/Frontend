<template>
  <div id="content">
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
                  style="color: #ffffff"
                >
                  mdi-wallet
                </v-icon>
                Mein Wallet
              </v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <div class="ma-5 pb-1">
              <h4>
                Meine persönliche Wallet Adresse:
                <v-chip>
                  <span
                    v-if="!gotResponse"
                    class="walletAddress"
                  >
                    loading....
                  </span>
                  <span
                    v-else
                    class="walletAddress"
                  >
                    {{ user.publickey }}
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
                  <h3
                    v-if="!gotResponse"
                    class="display-1 font-weight-light"
                  >
                    {{ 0 }} ETH
                  </h3>
                  <h3
                    v-else
                    class="display-1 font-weight-light"
                  >
                    {{ user.balance / weiFormula }} ETH
                  </h3>
                </v-chip>
              </div>
              <span class="" />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-parallax>
    <v-alert
      v-model="redeemFail"
      dismissible
      prominent
      tile
      class="text-center"
      type="error"
    >
      Beim Einlösen von '{{ redeemVTitle }}' ist ein Fehler aufgetreten {{ errorMessage }}
    </v-alert>
    <v-alert
      v-model="redeemSucc"
      dismissible
      prominent
      tile
      class="text-center"
      type="success"
    >
      Gutschein '{{ redeemVTitle }}' erfolgreich eingelöst!
    </v-alert>
    <div>
      <v-container>
        <v-row>
          <v-col>
            <v-card
              color="primary"
            >
              <v-toolbar
                color="primary"
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
                background-color="primary"
                slider-color="secondary"
                dark
                @change="voucherPage = 1"
              >
                <v-tab>
                  <v-chip
                    color="secondary"
                    class="v-chip--clickable"
                  >
                    <v-avatar
                      v-if="gotResponse"
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
                      v-if="gotResponse"
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
              <v-layout
                v-if="loadingVouchers==true"
                justify-center
              >
                <v-progress-circular
                  :size="50"
                  :width="7"
                  color="green"
                  indeterminate
                  class="loadingCircle"
                />
              </v-layout>
              <v-card-text
                v-else-if="vErrMsg.length !== 0"
                class="text-center"
              >
                <h1 class="my-10">
                  {{ vErrMsg }}
                </h1>
              </v-card-text>
              <v-row
                v-else
                class="ma-2"
              >
                <v-card-text
                  v-if="tabVouchers.length === 0"
                  class="text-center"
                >
                  <h1 class="my-10 noEntryText">
                    Keine Gutscheine vorhanden
                  </h1>
                </v-card-text>
                <v-col
                  v-for="voucher in tabVouchers.slice((voucherPage*4)-4,voucherPage*4)"
                  v-else
                  :key="voucher.id"
                  cols="12"
                >
                  <v-card
                    :color="voucher.used ? '#dddddd' : 'white'"
                  >
                    <v-card-title>{{ voucher.titel }}</v-card-title>
                    <v-card-subtitle class="overline">
                      {{ voucher.bought }}
                    </v-card-subtitle>
                    <v-card-text>{{ voucher.description }}</v-card-text>
                    <v-card-actions>
                      <v-btn
                        v-if="!voucher.used"
                        color="success"
                        :loading="reedemingVoucher"
                        @click="redeemVoucher(voucher)"
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
                        {{ voucher.price / weiFormula }} ETH
                      </h3>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
              <div class="text-center">
                <v-pagination
                  v-model="voucherPage"
                  :length="Math.ceil(tabVouchers.length/4)"
                  :total-visible="7"
                  light
                  color="secondary"
                />
              </div>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              color="primary"
              dark
            >
              <v-toolbar
                color="primary"
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
              <v-layout
                v-if="loadingDonations==true"
                justify-center
              >
                <v-progress-circular
                  :size="50"
                  :width="7"
                  color="green"
                  indeterminate
                  class="loadingCircle"
                />
              </v-layout>
              <v-card-text
                v-else-if="dErrMsg.length !== 0"
                class="text-center"
              >
                <h1 class="my-10">
                  {{ dErrMsg }}
                </h1>
              </v-card-text>
              <div v-else>
                <v-card-text
                  v-if="donations === null || donations === undefined || donations.length === 0"
                  class="text-center"
                >
                  <h1 class="my-10 noEntryText">
                    Keine Spenden getätigt
                  </h1>
                </v-card-text>
                <v-row
                  v-else
                  class="ma-2"
                >
                  <v-col
                    v-for="donation in donations.slice((donationPage*6)-6,donationPage*6)"
                    :key="donation.id"
                    cols="12"
                  >
                    <v-card
                      color="white"
                      light
                    >
                      <v-card-title>
                        {{ donation.projectname }}
                        <v-spacer />
                        <h3 class="pricetag font-weight-light">
                          {{ donation.amount / weiFormula }} ETH
                        </h3>
                      </v-card-title>
                      <v-card-subtitle class="overline lightgrey">
                        {{ donation.timeofdonation }}
                      </v-card-subtitle>
                    </v-card>
                  </v-col>
                </v-row>
                <div class="text-center">
                  <v-pagination
                    v-model="donationPage"
                    :length="Math.ceil(donations.length/6)"
                    :total-visible="7"
                    light
                    color="secondary"
                  />
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { userSession } from '../../userSession';

export default {
  name: 'Historie',
  data: () => ({
    weiFormula: 1e18,
    tab: null,
    donations: [],
    vouchers: [],
    errorMessage: '',
    vErrMsg: '',
    dErrMsg: '',
    gotResponse: false,
    user: null,
    redeemVTitle: '',
    redeemFail: false,
    redeemSucc: false,
    voucherPage: 1,
    donationPage: 1,
    loadingVouchers: true,
    loadingDonations: true,
    reedemingVoucher: false,
  }),
  computed: {
    tabVouchers() {
      return this.getVouchers(this.tab);
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      axios.get(`users?username=${window.user.username}`)
        .then((res) => {
          if (res.data.length === 0) {
            this.errorMessage = 'Could not fetch data';
          } else {
            [this.user] = res.data;
            this.loadDonations();
            this.loadVouchers();
          }
        }).catch((err) => {
          this.errorMessage = err.toString();
        }).finally(() => {
          this.gotResponse = true;
        });
    },
    getVouchers(used) {
      if (this.vouchers === null || this.vouchers === undefined) {
        return [];
      }
      if (used) {
        return this.vouchers.filter((voucher) => voucher.used);
      }
      return this.vouchers.filter((voucher) => !voucher.used);
    },
    loadVouchers() {
      this.loadingVouchers = true;
      axios.get(`vouchers/user?idUser=${this.user.id}`)
        .then((res) => {
          if (res.data.length !== 0) {
            this.vouchers = res.data;
          }
        }).catch((err) => {
          this.vErrMsg = err.toString();
        }).finally(() => {
          this.loadingVouchers = false;
        });
    },
    loadDonations() {
      this.loadingDonations = true;
      axios.get(`donations?iduser=${this.user.id}`)
        .then((res) => {
          if (res.data.length !== 0) {
            this.donations = res.data;
          } else {
            this.donations = [];
          }
        }).catch((err) => {
          this.dErrMsg = err.toString();
        }).finally(() => {
          this.loadingDonations = false;
        });
    },
    redeemVoucher(voucher) {
      const head = {
        authToken: userSession.loadUserData().authResponseToken,
        id: voucher.id,
      };
      this.reedemingVoucher = true;
      axios.delete('vouchers/user', { headers: head, data: {} })
        .then(() => {
          this.redeemSucc = true;
        }).catch((err) => {
          this.errorMessage = err.toString();
          this.redeemFail = true;
        }).finally(() => {
          this.reedemingVoucher = false;
          this.redeemVTitle = voucher.titel;
          this.loadData();
          window.scrollTo(0, 0);
        });
    },
  },
};
</script>

<style scoped>
  #content{
    background: rgb(2,0,36);
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);
    min-height: 100%;
  }

  .pricetag {
      font-size: 1.7rem;
  }

  .walletAddress {
    font-family: Courier;
  }

  .noEntryText{
    color: rgba(255,255,255,0.7);
  }

  .wallet {
    max-width: 500px;
  }

  .loadingCircle {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .lightgrey {
    color: rgba(0,0,0,0.6) !important;
  }
</style>
