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
                    <v-col class="text-center pageBox" cols="5">
                        <v-icon class="display-4" style="color: white">mdi-gift-outline</v-icon>
                        <h1 class="display-1  font-weight-thin mb-6">Spenden</h1>
                        <h1 class="display-2  font-weight-thin ">Spende über die Blockchain</h1>
                        <p align="justify" style="margin-left: 15%; margin-right: 15%">
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
                            dolores et ea rebum. Stet clita kasd gubergren, no sea.
                        </p>
                        <router-link
                                to="/gutscheine"
                                tag="span"
                        >
                            <v-btn class="title btn-hover white--text color-9" style="text-transform: none">
                                Jetzt spenden!
                            </v-btn>
                        </router-link>
                    </v-col>
                    <v-divider style="border-color:rgba(255,255,255,0.4);z-index: 5; height: 70vh"  vertical></v-divider>
                    <v-col class="text-center pageBox" cols="5">
                        <v-icon class="display-4" style="color: white">mdi-wallet-outline</v-icon>
                        <h1 class="display-1  font-weight-thin mb-6">Gutscheine</h1>
                        <h1 class="display-2  font-weight-thin">Unterstütze deine Umgebung!</h1>
                        <p align="justify" style="margin-left: 15%; margin-right: 15%">
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
                            dolores et ea rebum. Stet clita kasd gubergren, no sea.
                        </p>
                        <router-link
                                to="/gutscheine"
                                tag="span"
                        >
                            <v-btn class="title btn-hover white--text color-9" style="text-transform: none">
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
                        <v-icon class="display-2" style="color: white">mdi-gift-outline</v-icon>
                        <h1 class="subtitle-1  font-weight-thin mb-2">Spenden</h1>
                        <h1 class="headline  font-weight-thin ">Spende über die Blockchain</h1>
                        <p align="justify" style="margin-left: 15%; margin-right: 15%">
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
                            dolores et ea rebum. Stet clita kasd gubergren, no sea.
                        </p>
                        <router-link
                                to="/gutscheine"
                                tag="span"
                        >
                            <v-btn class="title btn-hover white--text color-9" style="text-transform: none">
                                Jetzt spenden!
                            </v-btn>
                        </router-link>
                    </div>
                    <hr>
                    <div class="pageBoxMobile">
                        <v-divider style="border-color:rgba(255,255,255,0.4);"></v-divider>
                        <v-icon class="display-2" style="color: white">mdi-wallet-outline</v-icon>
                        <h1 class="subtitle-1  font-weight-thin mb-6">Gutscheine</h1>
                        <h1 class="headline  font-weight-thin">Unterstütze deine Umgebung!</h1>
                        <p align="justify" style="margin-left: 15%; margin-right: 15%">
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
                            dolores et ea rebum. Stet clita kasd gubergren, no sea.
                        </p>
                        <router-link
                                to="/gutscheine"
                                tag="span"
                        >
                            <v-btn class="title btn-hover white--text color-9" style="text-transform: none">
                                Gutscheine kaufen!
                            </v-btn>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="bgcover"></div>
    </div>
</template>

<script>
    export default {
        name: 'Home',

        data: () => ({}),
    }
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
        top: 0px; /* Header Height */
        bottom: 0px; /* Footer Height */
        width: 100%;
        min-height: 100%;
        background-color: black;
        background: url(../../assets/casedonation.jpg) no-repeat center center fixed;
        background-size: cover;
    }

    .bgcover {
        position: fixed;
        z-index: 1;
        top: 0px; /* Header Height */
        width: 100%;
        height: 100vh;
        background: linear-gradient(to right, rgba(26, 225, 79, 0.3), rgba(63, 134, 237, 0.3));
        background-color: rgba(0, 0, 0, 0.5);
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

</style>
