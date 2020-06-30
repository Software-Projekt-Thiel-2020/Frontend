<template>
  <div class="mainbody">
    <div class="pageContent">
      <div class="text-center hidden-sm-and-down">
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
          <v-col
            class="text-center pageBox"
            cols="5"
          >
            <v-icon
              class="display-4"
              style="color: white"
            >
              mdi-gift-outline
            </v-icon>
            <h1 class="display-1  font-weight-thin mb-6">
              Spenden
            </h1>
            <h1 class="display-2  font-weight-thin mb-2">
              Spende über die Blockchain
            </h1>
            <p
              align="justify"
              style="margin-left: 15%; margin-right: 15%"
            >
              Mit unserem Transparenten verfahren kommt deine Spende da an, wo sie auch gebraucht wird. Finde ein Spendenprojekt oder ein Unternehmen dem du gerne helfen möchtest.
            </p>
            <router-link
              to="/spenden"
              tag="span"
            >
              <v-btn
                class="title btn-hover white--text color-9"
                style="text-transform: none"
              >
                Jetzt spenden!
              </v-btn>
            </router-link>
          </v-col>
          <v-divider
            style="border-color:rgba(255,255,255,0.4);z-index: 5; height: 70vh"
            vertical
          />
          <v-col
            class="text-center pageBox"
            cols="5"
          >
            <v-icon
              class="display-4"
              style="color: white"
            >
              mdi-wallet-outline
            </v-icon>
            <h1 class="display-1  font-weight-thin mb-6">
              Gutscheine
            </h1>
            <h1 class="display-2  font-weight-thin mb-2">
              Unterstütze deine Umgebung!
            </h1>
            <p
              align="justify"
              style="margin-left: 15%; margin-right: 15%"
            >
              Dein Kino um die Ecke, das Restaurant bei dem es die besten Gerichte in der Stadt gibt, der Kiosk auf deinem Weg zur Arbeit. Sie alle sind von COVID-19 Virus betroffen und brauchen deine Hilfe um auch in Zukunft für dich dazusein.
            </p>
            <router-link
              to="/gutscheine"
              tag="span"
            >
              <v-btn
                class="title btn-hover white--text color-9"
                style="text-transform: none"
              >
                Gutscheine kaufen!
              </v-btn>
            </router-link>
          </v-col>
        </v-row>
      </div>
      <div class="text-center hidden-md-and-up">
        <div class="pageHeaderMobile">
          <h1 class="display-1 font-weight-thin white--text">
            Spenderschlender
          </h1>
          <h1 class="subtitle-1 font-weight-thin white--text">
            Vertrauensvoll - Transparent - Blockchain
          </h1>
        </div>
        <div class="white--text">
          <div class="pageBoxMobile">
            <v-icon
              class="display-2"
              style="color: white"
            >
              mdi-gift-outline
            </v-icon>
            <h1 class="subtitle-1  font-weight-thin mb-2">
              Spenden
            </h1>
            <h1 class="headline  font-weight-thin ">
              Spende über die Blockchain
            </h1>
            <p
              align="justify"
              style="margin-left: 15%; margin-right: 15%"
            >
              Mit unserem Transparenten verfahren kommt deine Spende da an, wo sie auch gebraucht wird. Finde ein Spendenprojekt oder ein Unternehmen dem du gerne helfen möchtest.
            </p>
            <router-link
              to="/spenden"
              tag="span"
            >
              <v-btn
                class="title btn-hover white--text color-9"
                style="text-transform: none"
              >
                Jetzt spenden!
              </v-btn>
            </router-link>
          </div>
          <hr>
          <div class="pageBoxMobile">
            <v-divider style="border-color:rgba(255,255,255,0.4);" />
            <v-icon
              class="display-2"
              style="color: white"
            >
              mdi-wallet-outline
            </v-icon>
            <h1 class="subtitle-1  font-weight-thin mb-6">
              Gutscheine
            </h1>
            <h1 class="headline  font-weight-thin">
              Unterstütze deine Umgebung!
            </h1>
            <p
              align="justify"
              style="margin-left: 15%; margin-right: 15%"
            >
              Dein Kino um die Ecke, das Restaurant bei dem es die besten Gerichte in der Stadt gibt, der Kiosk auf deinem Weg zur Arbeit. Sie alle sind von COVID-19 Virus betroffen und brauchen deine Hilfe um auch in Zukunft für dich dazusein.
            </p>
            <router-link
              to="/gutscheine"
              tag="span"
            >
              <v-btn
                class="title btn-hover white--text color-9"
                style="text-transform: none"
              >
                Gutscheine kaufen!
              </v-btn>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="bgcover" />
  </div>
</template>

<script>
export default {
  name: 'Home',

  data: () => ({}),
};
</script>

<style>


    .pageContent {
        position: relative;
        z-index: 5;
    }

    .pageHeader {
        height: 120px;
        padding-top: 10px;
        backdrop-filter: blur(15px) brightness(0.9);
    }

    .pageHeaderMobile {
        height: 90px;
        padding-top: 10px;
        backdrop-filter: blur(15px) brightness(0.9);
    }

    .pageBox {
        position: relative;
        top: -10%
    }

    .pageBoxMobile{
        margin-bottom: 30px;
    }

    .mainbody {
        position: relative;
        z-index: 0;
        top: 0; /* Header Height */
        bottom: 0; /* Footer Height */
        width: 100%;
        min-height: 100%;
        background-color: black;
        background: url(../../assets/casedonation.jpg) no-repeat center center fixed;
        background-size: cover;
    }

    .bgcover {
        position: fixed;
        z-index: 1;
        top: 0; /* Header Height */
        width: 100%;
        height: 100vh;
        background: linear-gradient(to right, rgba(26, 225, 79, 0.3), rgba(63, 134, 237, 0.3));
        background-color: rgba(0, 0, 0, 0.5);
    }

    .btn-hover {
        background-size: 300% 100%;
        border-radius: 50px;
        text-shadow: rgba(0, 0, 0, 0.7) 0 0 5px;
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
