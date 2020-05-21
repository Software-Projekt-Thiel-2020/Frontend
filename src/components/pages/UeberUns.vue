<template>
    <v-card class="containerBox">
        <h1>Über Uns</h1>
        <v-divider></v-divider><br>

        <!-- TEXT SECTION-->
        <v-row>
            <v-col>
                <h2 id="was_ist_spenderschlender">Was ist Spenderschlender</h2>
                <p class="text-left"></p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst.
                <br/>
                <h2>Warum Sie uns vertrauen können</h2>
                <h3>Transparenz</h3>
                Wir sind sogar fast durchsichtig<br>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                <h3>Ethereum</h3>
                Etherum ist toll.<br>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            </v-col>
        </v-row>
        <br><br>
        <v-divider></v-divider>


        <!--FAQ SECTION-->
        <h1>FAQ</h1>
        <br>
        <v-expansion-panels focusable accordion multiple>
            <v-expansion-panel class="qa">
                <v-expansion-panel-header>
                    <span class="question">
                        <span class="font-weight-bold">Q:</span>
                        Behaltet ihr Geld ein?
                    </span>
                </v-expansion-panel-header>
                <v-divider></v-divider>
                <v-expansion-panel-content class="answerBox">
                    <v-row>
                        <div>
                            <span class="font-weight-bold">A:</span>
                        </div>
                        <v-col class="pa-0 pl-1">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-header>
                    <span class="question">
                        <span class="font-weight-bold">Q:</span>
                        Ist das Frontend geil?
                    </span>
                </v-expansion-panel-header>
                <v-divider></v-divider>
                <v-expansion-panel-content class="answerBox">
                    <v-row>
                        <div>
                            <span class="font-weight-bold">A:</span>
                        </div>
                        <v-col class="pa-0 pl-1">
                         Die Antworten könnten die Bevölkerung verunsichern
                        </v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
</template>

<script>
    export default {
        name: "UeberUns",
    }
</script>

<style scoped>
    .containerBox {
        align-content: center;
        line-break: auto;
        margin-top: 15px;
        margin-left: 20px;
        margin-right: 20px;
        padding: 20px;

        background-color: rgba(231,232,255,0.56);
    }

    .qa {
        margin-bottom: 10px;
    }

    .answerBox {
        padding: 0px 0px 0px 13px;
        font-size: 0.9375rem;
    }

</style>
