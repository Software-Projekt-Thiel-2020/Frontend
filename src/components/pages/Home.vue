<template>
  <div class="mainbody">
    <div class="bgcover text-center">
      <div class="pageHeader">
        <h1 class="display-3 font-weight-thin white--text">
          Spenderschlender
        </h1>
        <h1 class="headline font-weight-thin white--text">
          Vertrauensvoll - Transparent - Blockchain
        </h1>

      </div>
      <v-row
              align="center"
              justify="center"
              class="white--text pageContent"
      >
        <v-col class="text-center pageBox" cols="5">
          <v-icon class="display-4" style="color: white">mdi-gift-outline</v-icon>
          <h1 class="display-3  font-weight-thin mb-4">Spende über die Blockchain</h1>
          <v-btn class="title btn-hover white--text color-9" style="text-transform: none">
            Gute Tat erledigen!
          </v-btn>
        </v-col>
        <v-divider style="border-color:rgba(255,255,255,0.4);" vertical></v-divider>
        <v-col class="text-center pageBox" cols="5">
          <v-icon class="display-4" style="color: white">mdi-wallet-outline</v-icon>
          <h1 class="display-3  font-weight-thin mb-4">Unterstütze deine Umgebung!</h1>
          <v-btn class="title btn-hover white--text color-9" style="text-transform: none">
            Gutscheine kaufen
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Home',

    data: () => ({
    }),
  }
</script>

<style>


  .pageContent {
    height: calc(100% - 130px);
  }

  .pageHeader {
    height: 120px;
    padding-top: 10px;
    backdrop-filter: blur(15px) brightness(0.9);
  }

  .pageBox{
    position:relative;
    top:-10%
  }

  .mainbody{
    position: absolute;
    top: 0px; /* Header Height */
    bottom: 0px; /* Footer Height */
    width: 100%;
    background: url(../../assets/casedonation.jpg) no-repeat center center fixed;
    background-size: cover;
  }
  .bgcover{
    position: absolute;
    top: 0px; /* Header Height */
    bottom: 0px; /* Footer Height */
    width: 100%;
    background: linear-gradient(to right, rgba(26, 225, 79,0.3), rgba(63, 134, 237,0.3));
    background-color: rgba(0,0,0,0.5);
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
