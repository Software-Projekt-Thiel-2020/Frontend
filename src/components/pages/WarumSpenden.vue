<template>
  <div>
    <v-parallax
      dark
      height="325"
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
          <v-icon class="display-3 mb-4">
            mdi-ethereum
          </v-icon>
          <h1 class="display-1 font-weight-thin mb-4">
            Warum Sie spenden sollten!
          </h1>
        </v-col>
      </v-row>
    </v-parallax>


    <v-container v-resize="onResize">
      <div class="argument">
        <v-row>
          <v-col>
            <h3>Spenden hilft der Welt</h3>
            <p class="text-left">
              Besonders in der Zeit von Corona sind etliche lokale Restaurants und Unternehmen kurz vor der Insolvenz.
              Damit Sie auch in Zukunft in Ihrem Lieblingsrestaurant essen können bietet unsere Seite die perfekte
              Möglichkeit, um diese zu unterstützen. Bereits eine kleine Spende, oder der Kauf eines Gutscheins, kann es einem
              Kleinunternehmer ermöglichen, dass sein Betrieb auch weiterhin existiert. Dadurch können Sie auch künftig
              die Dienste von Betrieben in Ihrer Nähe in Anspruch nehmen.
            </p>
          </v-col>
          <v-col
            v-if="!custom"
            cols="4"
          >
            <v-img src="https://picsum.photos/510/300?random" />
          </v-col>
        </v-row>
      </div>

      <div class="argument">
        <v-row>
          <v-col
            v-if="!custom"
            cols="4"
          >
            <v-img src="https://picsum.photos/510/200?random" />
          </v-col>
          <v-col>
            <h3>Geld ist geil</h3>
            <p class="text-left">
              Geld ist geil und deshalb profitieren auch Sie, wenn Sie eine Spende tätigen. Abgesehen von dem
              guten Gefühl, welches Sie erhalten, wenn Sie Menschen in der Not helfen, ist es im Zuge
              der Coronakrise möglich, Ihren gespendeten Betrag von der Steuer abzusetzen. Dies ist allerdings erst ab
              einer Spende von 200€ der Fall.
            </p>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'WarumSpenden',
  data: () => ({
    custom: false,
  }),
  mounted() {
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
  },
  methods: {
    onResize() {
      this.custom = window.innerWidth <= 700;
    },
  },
};
</script>

<style>

  .argument {
    background-color: rgba(205,206,226,0.56);
    padding: 25px;
  }

  p {
    text-align: justify;
  }

</style>
