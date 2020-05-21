<template>
  <v-footer
    dark
    padless
  >
    <v-card
      flat
      tile
      class="primary white--text text-center"
      style="width: 100vw"
    >
      <v-card-text>
        <router-link
          to="/agb"
          tag="span"
          class="ma-3"
        >
          <span class="link white--text">Unsere AGB</span>
        </router-link>
        <router-link
          to="/datenschutz"
          tag="span"
          class="ma-3"
        >
          <span class="link white--text">Datenschutzerklärung</span>
        </router-link>
        <router-link
          to="/impressum"
          tag="span"
          class="ma-3"
        >
          <span class="link white--text">Impressum</span>
        </router-link>

        <br>

        <router-link
          to="/warumspenden"
          tag="span"
          class="ma-3"
        >
          <v-btn
            target="_blank"
            class="btn-hover color-9 mt-3"
            style="text-transform: none"
          >
            Warum Du bei uns spenden solltest...
          </v-btn>
        </router-link>
      </v-card-text>

      <v-divider />

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>Spenderschlender</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
    .link {
        color: white;
        cursor: pointer;
        text-decoration: underline;
    }

    .btn-hover {
        background-size: 300% 100%;
        border-radius: 50px;
        text-shadow: rgba(0,0,0,0.7) 0px 0px 5px;
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


</style>
