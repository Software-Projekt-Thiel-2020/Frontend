<template>
  <Default
    :title="institution ? institution[0].name : 'Institution'"
    :loading="loadingVouchers || loadingProject"
  >
    <v-row>
      <v-col
        v-for="voucher in vouchers"
        :key="voucher.id"
        cols="12"
        sm="12"
        md="6"
        lg="4"
        xl="3"
      >
        <MyCard>
          <template #title>
            {{ voucher.title }}
          </template>

          <template #subtitle>
            {{ voucher.subject }}
          </template>

          <template #text>
            <v-row>
              <v-col>
                <h4>
                  Preis:
                </h4>
                {{ '≈ ' + getETHValue(voucher.price) + '€' }}
              </v-col>
              <v-col class="mr-3">
                <h4>
                  Gültigkeit:
                </h4>
                {{ voucher.validTime / 60 / 60 / 24 / 365 }} Jahr(e)
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h5>
                  Wurde bereits {{ voucher.amount }} mal gekauft
                </h5>
              </v-col>
            </v-row>

            <div class=" text-center">
              <v-btn
                :id="voucher.id"
                class="mt-2 btn-hover color-9"
                dark
                :loading="loading && indexClicked === voucher.id"
                @click="buyVoucher(voucher)"
              >
                {{ `${!$vuetify.breakpoint.xsOnly ? 'Gutschein' : ''} Kaufen` }}
              </v-btn>
            </div>
          </template>
        </MyCard>
      </v-col>
    </v-row>

    <v-divider class="my-5" />

    <v-card
      v-if="institution"
      class="mt-6 grey--text text--darken-2"
      elevation="10"
    >
      <v-system-bar
        color="secondary"
        height="40px"
        class="text-center"
      >
        <v-card-text
          class="headline font-weight-thin"
          style="color: white"
        >
          {{ institution[0].name }}
        </v-card-text>
      </v-system-bar>
      <v-card-text>
        <v-img
          v-if="institution[0].picturePath"
          class="mb-4"
          max-height="300px"
          contain
          :src="institution[0].picturePath ? (apiurl+'/file/'+institution[0].picturePath) : require(`@/assets/placeholder.png`)"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="grey darken-5"
              />
            </v-row>
          </template>
        </v-img>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="compiledMarkdown" />
      </v-card-text>
      <div class="text-center">
        <v-btn
          outlined
          color="grey"
          class="mb-4 mx-2"
          :href="institution[0].webpage"
        >
          Webseite besuchen
        </v-btn>
      </div>
    </v-card>

    <v-dialog
      v-if="boughtVoucher "
      v-model="dialog"
      :max-width="$vuetify.breakpoint.smAndDown ? '95vw':'50vw'"
      persistent
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
            v-if="!dialogBreak"
            class="mr-2 display-2"
            color="red"
          >
            mdi-cards-heart
          </v-icon>
          Gutschein erworben!
          <v-icon
            v-if="!dialogBreak"
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
              <br v-if="!dialogBreak">
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
  </Default>
</template>

<script>
import axios from 'axios';
import marked from 'marked';
import DOMPurify from 'dompurify';
import { userSession } from '@/userSession';
import EventBus from '@/utils/eventBus';

import Default from '../Default.vue';
import MyCard from '../MyCard.vue';

export default {
  name: 'ProjectGutschein',
  components: {
    Default,
    MyCard,
  },
  data: () => ({
    customBreak: false,
    pictureBreak: false,
    dialogBreak: false,
    apiurl: window.apiurl,
    userSession: null,
    userData: null,
    institutionId: null,
    dialog: false,
    institution: undefined,
    image: 'https://i.imgur.com/EJOjIMC.jpg',
    vouchers: [],
    loadingVouchers: true,
    loadingProject: true,
    exrate: 0,
    ethToEur: 0,
    loading: false,
    indexClicked: null,
    boughtVoucher: null,
  }),
  computed: {
    compiledMarkdown() {
      return this.institution ? marked(DOMPurify.sanitize(this.institution[0].description)) : '';
    },
  },
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
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true });
    }
  },
  methods: {
    onResize() {
      this.customBreak = window.innerWidth < 848;
      this.pictureBreak = window.innerWidth < 640;
      this.dialogBreak = window.innerWidth < 500;
    },
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
          this.institution = res.data;
        })
        .catch((err) => {
          EventBus.$emit('new-snackbar', `Institution konnten nicht geladen werden ${err.toString()}`, 'error', 10000, true);
        }).finally(() => {
          this.loadingProject = false;
        });
    },
    loadVouchers() {
      let url = 'vouchers/institution?idInstitution=';
      url += this.institutionId;
      url += '&available=1';
      this.loadingVouchers = true;
      axios.get(url)
        .then((res) => {
          this.vouchers = res.data;
        })
        .catch((err) => {
          EventBus.$emit('new-snackbar', `Gutscheine konnten nicht geladen werden ${err.toString()}`, 'error', 10000, true);
        }).finally(() => {
          this.loadingVouchers = false;
        });
    },
    weiToEuro() {
      axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR')
        .then((res) => {
          this.ethToEur = res.data.EUR / 1e18;
        })
        .catch((err) => {
          EventBus.$emit('new-snackbar', `Etherum Wechselkurs konnte nicht geladen werden ${err.toString()}`, 'error', 10000, true);
        });
    },
    buyVoucher(voucher) {
      if (this.userData == null) {
        EventBus.$emit('new-snackbar', 'Bitte melden Sie sich an', 'error', 10000, true);
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
            EventBus.$emit('reload-user');
          })
          .catch((err) => {
            EventBus.$emit('new-snackbar', `Gutschein konnte nicht gekauft werden ${err.toString()}`, 'error', 10000, true);
          }).finally(() => {
            this.loading = false;
          });
      }
    },
    showValue(value) {
      if (value > 1e10) return `${(value / 1e18).toFixed(8)} ETH`;
      if (value > 1e6) return `${(value / 1e6)} MWEI`;
      return `${value} WEI`;
    },
    openDialog() {
      this.dialog = true;
      this.$confetti.start();
    },
    closeDialog() {
      this.dialog = false;
      this.$confetti.stop();
      this.loadVouchers();
    },
  },
};
</script>

<style scoped>
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
