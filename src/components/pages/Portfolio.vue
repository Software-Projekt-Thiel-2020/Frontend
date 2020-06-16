<template>
  <div>
    <v-parallax
      dark
      height="100"
      src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          class="text-center"
          cols="10"
        >
          <h1 class="display-1 font-weight-thin">
            <v-icon
              class="display-2"
              style="color: white"
            >
              mdi-wallet
            </v-icon>
            Mein Portfolio
          </h1>
        </v-col>
      </v-row>
    </v-parallax>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
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
            <v-card-text class="text-center">
              <h1 class="my-10">
                Keine Gutscheine vorhanden
              </h1>
            </v-card-text>
            <v-row class="ma-2">
              <v-col v-for="voucher in vouchers" v-bind:key="voucher.id">
                <v-card :color="voucher.used ? '#dddddd' : 'white'">
                  <v-card-title>{{voucher.title}}</v-card-title>
                  <v-card-subtitle class="overline">Restaurante Panini</v-card-subtitle>
                  <v-card-text>{{voucher.subject}}</v-card-text>
                  <v-card-actions>
                    <v-btn color="success" v-if="!voucher.used">Einlösen</v-btn>
                    <v-btn disabled outlined v-if="voucher.used">Eingelöst</v-btn>
                    <v-spacer></v-spacer>
                    <h3 class="pricetag font-weight-light">{{voucher.amount}} ETH</h3>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
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
            <v-card-text class="text-center">
              <h1 class="my-10">
                Keine Spenden getätigt
              </h1>
            </v-card-text>
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
    donations: [
      {
        id: 3,
        amount: 5012,
        userid: 2,
        milestoneid: 1,
      },
    ],
    vouchers: [
      {
        id: 3,
        amount: 307500,
        userid: 2,
        institutionid: 3,
        subject: 'Für ein leckeres Eis bei der Eisdiele in der Bäckerstraße, bis zu 2 Kugeln.',
        title: 'Eis Eisd. Baeckerstr. max 2 Kug',
        untilTime: 3164658364,
        used: true,
      }, {
        id: 1,
        amount: 10703,
        userid: 1,
        institutionid: 1,
        subject: 'Ein Restaurantbesuch beim Griechen Athen, bis zu 4 Personen.',
        title: 'Besuch Restaurant Athen 4 Pers.',
        untilTime: 46456474376,
        used: false,
      },
      {
        id: 5,
        amount: 307500,
        userid: 2,
        institutionid: 3,
        subject: 'Für ein leckeres Eis bei der Eisdiele in der Bäckerstraße, bis zu 2 Kugeln.',
        title: 'Eis Eisd. Baeckerstr. max 2 Kug',
        untilTime: 3164658364,
        used: true,
      }, {
        id: 2,
        amount: 10703,
        userid: 1,
        institutionid: 1,
        subject: 'Ein Restaurantbesuch beim Griechen Athen, bis zu 4 Personen.',
        title: 'Besuch Restaurant Athen 4 Pers.',
        untilTime: 46456474376,
        used: false,
      },
    ],
  }),
};
</script>

<style scoped>
    .pricetag{
      font-size: 1.5rem;
    }
</style>
