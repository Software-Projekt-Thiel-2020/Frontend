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
            Inspirierender Text, welcher Gefühle anspricht.Inspirierender Text, welcher Gefühle anspricht.Inspirierender Text, welcher Gefühle anspricht.Inspirierender Text, welcher Gefühle anspricht.Inspirierender Text, welcher Gefühle anspricht.Inspirierender Text, welcher Gefühle anspricht.Inspirierender Text, welcher Gefühle anspricht.Inspirierender Text, welcher Gefühle anspricht.Inspirierender Text, welcher Gefühle anspricht.
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
            Inspirierender Text, welcher Gefühle anspricht.Inspirierender Text, welcher Gefühle anspricht.Inspirierender Text, welcher Gefühle anspricht.
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

</style>
