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


    <v-container>
      <div class="argument">
        <v-row>
          <v-col cols="6">
            <h3>Spenden hilft der Welt</h3>
            <p>
              Besonders in der Zeit von Corona sind etliche lokale Restaurants und Unternehmen kurz vor der Insolvenz.
              Damit Sie auch in Zukunft in Ihrem Lieblingsrestaurant essen können bietet unsere Seite die perfekte
              Möglichkeit, um diese zu unterstützen. Bereits eine kleine Spende, oder der Kauf eines Gutscheins, kann es einem
              Kleinunternehmer ermöglichen, dass sein Betrieb auch weiterhin existiert. Dadurch können Sie auch künftig
              die Dienste von Betrieben in Ihrer Nähe in Anspruch nehmen.
            </p>
          </v-col>
          <v-col cols="1" />
          <v-col cols="5">
            <v-img src="https://picsum.photos/510/300?random" />
          </v-col>
        </v-row>
      </div>

      <div class="argument">
        <v-row>
          <v-col cols="6">
            <v-img src="https://picsum.photos/510/200?random" />
          </v-col>
          <v-col cols="1" />
          <v-col cols="5">
            <h3>Geld ist geil</h3>
            <p>
              Geld ist geil und deshalb profitieren auch Sie, wenn Sie ein Spende tätigen. Abgesehen von dem
              guten Gefühl, dass Sie Menschen in der Not geholfen haben, ist es auch möglich im Zuge
              der Coronakriese Ihren gespendeten Betrag von der Steuer abzusetzen. Dies ist allerdings erst ab
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
