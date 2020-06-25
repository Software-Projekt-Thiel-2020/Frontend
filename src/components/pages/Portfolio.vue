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
                    left
                    color="primary"
                  >
                    {{ getVouchers(false).length }}
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
                    left
                    color="primary"
                  >
                    {{ getVouchers(true).length }}
                  </v-avatar>
                  Eingelöst
                </v-chip>
              </v-tab>
            </v-tabs>
            <v-card-text
              v-if="vouchers.length == 0"
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
                  <v-card-title>{{ voucher.title }}</v-card-title>
                  <v-card-subtitle class="overline">
                    {{ voucher.institution.title }}
                  </v-card-subtitle>
                  <v-card-text>{{ voucher.subject }}</v-card-text>
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
                      {{ voucher.amount }} ETH
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
              v-if="donations.length == 0"
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
                v-for="donation in donations"
                :key="donation.id"
                cols="12"
              >
                <v-card>
                  <v-card-title>{{ donation.title }}</v-card-title>
                  <v-card-subtitle class="overline">
                    {{ donation.project.title }}
                  </v-card-subtitle>
                  <v-card-text>{{ donation.subject }}</v-card-text>
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
export default {
  name: 'Historie',
  data: () => ({
    tab: null,
    wallet: {
      adress: '0x1D1479C185d32EB90533a08b36B3CFa5F84A0E6B',
      amount: '1337.5012',
    },
    donations: [
      {
        id: 3,
        amount: 5012,
        userid: 2,
        project: { id: 1, title: 'DRK OV Lübbecke' },
        milestoneid: 1,
      },
    ],
    vouchers: [
      {
        id: 3,
        amount: 307500,
        userid: 2,
        institution: { id: 3, title: 'Eiscafe Italia' },
        subject: 'Für ein leckeres Eis bei der Eisdiele in der Bäckerstraße, bis zu 2 Kugeln.',
        title: 'Eis Eisd. Baeckerstr. max 2 Kug',
        untilTime: 3164658364,
        used: true,
      }, {
        id: 1,
        amount: 10703,
        userid: 1,
        institution: { id: 1, title: 'Restaurante Athen' },
        subject: 'Ein Restaurantbesuch beim Griechen Athen, bis zu 4 Personen.',
        title: 'Besuch Restaurant Athen 4 Pers.',
        untilTime: 46456474376,
        used: true,
      }, {
        id: 2,
        amount: 10703,
        userid: 1,
        institution: { id: 1, title: 'Restaurante Athen' },
        subject: 'Ein Restaurantbesuch beim Griechen Athen, bis zu 4 Personen.',
        title: 'Besuch Restaurant Athen 4 Pers.',
        untilTime: 46456474376,
        used: false,
      },
      {
        id: 5,
        amount: 307500,
        userid: 2,
        institution: { id: 3, title: 'Eiscafe Italia' },
        subject: 'Für ein leckeres Eis bei der Eisdiele in der Bäckerstraße, bis zu 2 Kugeln.',
        title: 'Eis Eisd. Baeckerstr. max 2 Kug',
        untilTime: 3164658364,
        used: false,
      },
    ],
  }),
  methods: {
    getVouchers(used) {
      if (used) {
        return this.vouchers.filter((voucher) => voucher.used);
      }
      return this.vouchers.filter((voucher) => !voucher.used);
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
