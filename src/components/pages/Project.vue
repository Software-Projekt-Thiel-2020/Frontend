<template>
    <div class="gradientBackground">
        <div class="titleHeader text-center">
            <h1 :class="$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-3'" class="font-weight-thin white--text">
                {{project.type === 'donate' ? 'Spendenseite' : 'Betriebsseite'}}
            </h1>
        </div>
        <v-container>
            <v-row>
                <v-col>
                    <v-card class="projectBox" elevation="4">
                        <v-card-title class="font-weight-light display-1">
                            {{project.name}}
                        </v-card-title>
                        <v-card-text>
                            <div class="mb-4">
                                <h3>Adresse</h3>
                                {{project.street}}<br/>
                                {{project.zip}} {{project.city}}
                            </div>
                            <v-card elevation="7" class="py-6 text-center">
                                <v-row>
                                    <v-col>
                                        <h4 class="headline">Gesammelt</h4>
                                        <h1 class="display-2 font-weight-thin">
                                            {{project.donationGoal.reached.toFixed(2)}}€</h1>
                                    </v-col>
                                    <v-col>
                                        <h4 class="headline">Ziel</h4>
                                        <h1 class="display-2 font-weight-thin">
                                            {{project.donationGoal.total.toFixed(2)}}€</h1>
                                    </v-col>
                                </v-row>
                                <h2>{{(getDonationGoalPercentage).toFixed(1)}}%</h2>
                                <v-progress-linear
                                        color="secondary"
                                        height="15"
                                        :value="getDonationGoalPercentage"
                                        striped
                                ></v-progress-linear>
                                <br/>
                                <hr/>
                                <currency-input class="mt-3 headline" v-model="donationValue"/>
                                <br/>
                                <v-btn class="mt-2 btn-hover color-9" dark>Betrag Spenden</v-btn>
                            </v-card>
                        </v-card-text>
                        <v-card-actions>
                            <a :href="project.homepage">
                                <v-btn outlined>Webseite besuchen</v-btn>
                            </a>

                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card>
                        <v-img :src="project.image"/>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: "Project",
        data: () => ({
            project: {
                name: "Deutsches Rotes Kreuz",
                street: "Osnabrücker Str. 62",
                zip: 32312,
                city: "Lübbecke",
                type: "donate",
                homepage: "https://google.de/",
                image: "https://i.imgur.com/EJOjIMC.jpg",
                donationGoal: {
                    total: 5000.00,
                    reached: 631.23,
                }
            },
            donationValue: 0,
        }),
        computed: {
            getDonationGoalPercentage: function () {
                return this.project.donationGoal.reached / this.project.donationGoal.total * 100;
            }
        }
    }
</script>

<style scoped>
    .titleHeader {
        padding-bottom: 15px;
        padding-top: 10px;
        backdrop-filter: blur(15px) brightness(0.5);
    }

    .gradientBackground {
        background: linear-gradient(to right, rgb(199, 255, 212), rgb(176, 218, 255));
        background-color: rgb(255, 255, 255);
    }

    .projectBox {
        padding: 20px;
        background-color: rgba(255, 255, 255, 0.8);

    }

    .goalBox {
        border: 1px dotted black;
    }


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
</style>
