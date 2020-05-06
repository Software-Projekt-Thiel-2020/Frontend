<template>
    <div>
        <v-app-bar
                app
                color="primary"
                dark
        >
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
            <router-link
                    to="/"
                    tag="span"
            >
                <v-btn class="d-flex align-center text-none" text>
                    <h2>BlockchainProjekt</h2>
                </v-btn>
            </router-link>

            <v-spacer></v-spacer>
            <router-link
                    to="/"
                    tag="span"
            >
                <v-btn
                        target="_blank"
                        color="secondary"
                        class="ma-2"
                >
                    <span class="mr-2">Home</span>
                    <v-icon>mdi-home</v-icon>
                </v-btn>
            </router-link>
            <router-link
                    to="/workers"
                    tag="span"
            >
                <v-btn
                        target="_blank"
                        color="secondary"
                        class="ma-2"
                >
                    <span class="mr-2">Meine Spenden</span>
                    <v-icon>mdi-worker</v-icon>
                </v-btn>
            </router-link>
            <router-link
                    to="/information"
                    tag="span"
            >
                <v-btn
                        target="_blank"
                        color="secondary"
                        class="ma-2"
                >
                    <span class="mr-2">Über uns</span>
                    <v-icon>mdi-information-outline</v-icon>
                </v-btn>
            </router-link>
            <router-link
                    to="/events"
                    tag="span"
            >
                <v-btn
                        target="_blank"
                        color="secondary"
                        class="ma-2"
                >
                    <span class="mr-2">Anmelden</span>
                    <v-icon>mdi-party-popper</v-icon>
                </v-btn>
            </router-link>
            <router-link
                    to="/rooms"
                    tag="span"
            >
                <v-btn
                        target="_blank"
                        color="secondary"
                        class="ma-2"
                >
                    <span class="mr-2">Kontakt</span>
                    <v-icon>mdi-door</v-icon>
                </v-btn>
            </router-link>
            <router-link
                    to="/checkin"
                    tag="span"
            >
                <v-btn
                        class="ma-2"
                        target="_blank"
                        rounded
                        color="accent"
                >
                    <span class="mr-2">Einchecken</span>
                    <v-icon>mdi-run</v-icon>
                    <v-icon>mdi-arrow-right-thick</v-icon>
                </v-btn>
            </router-link>
        </v-app-bar>


        <v-navigation-drawer
                v-model="drawer"
                absolute
                temporary
        >
            <v-list
                    nav
                    dense
            >
                <v-list-item-group
                        v-model="group"
                        active-class="deep-purple--text text--accent-4"
                >
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Account</v-list-item-title>
                    </v-list-item>

                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
    export default {
        name: "Navbar",
        data: () => ({
            drawer: false,
        }),
    }
</script>

<style scoped>

</style>