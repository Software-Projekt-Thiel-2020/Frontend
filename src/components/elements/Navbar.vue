<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = true"
      />
      <router-link
        to="/"
        tag="span"
        class="hidden-sm-and-down"
      >
        <v-btn
          class="d-flex align-center text-none"
          text
        >
          <h2>Spenderschlender</h2>
        </v-btn>
      </router-link>

      <router-link
        to="/"
        tag="span"
        class="hidden-sm-and-down"
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
        to="/ueberuns"
        tag="span"
        class="hidden-sm-and-down"
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

      <v-spacer />

      <router-link
        to="/portfolio"
        tag="span"
        class="hidden-sm-and-down"
      >
        <v-btn
          v-if="loggedIn"
          target="_blank"
          color="accent"
          class="ma-2"
        >
          <span class="mr-2">Mein Portfolio</span>
          <v-icon>mdi-wallet</v-icon>
        </v-btn>
      </router-link>


      <v-btn
        v-if="!loggedIn"
        class="ma-2 hidden-sm-and-down"
        target="_blank"
        rounded
        color="accent"
        @click="loggedIn = true"
      >
        <span class="mr-2">Anmelden</span>
        <v-icon>mdi-run</v-icon>
        <v-icon>mdi-arrow-right-thick</v-icon>
      </v-btn>


      <v-menu
        v-if="loggedIn"
        bottom
        left
        :offset-y="true"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            dark
            icon
            class="hidden-sm-and-down"
            v-on="on"
          >
            <v-avatar color="red">
              <span class="white--text headline">CJ</span>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <router-link
              to="/profil"
              tag="span"
            >
              <v-list-item-title class="clickable">
                <v-icon class="mr-1">
                  mdi-wrench
                </v-icon>Mein Profil
              </v-list-item-title>
            </router-link>
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              class="clickable"
              @click="loggedIn = false"
            >
              <v-icon class="mr-1">
                mdi-logout
              </v-icon>Abmelden
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
          active-class="deep-purple--text text--accent-4"
        >
          <router-link
            to="/"
            tag="span"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
          </router-link>


          <router-link
            to="/ueberuns"
            tag="span"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-information-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Über uns</v-list-item-title>
            </v-list-item>
          </router-link>

          <v-spacer />

          <router-link
            v-if="loggedIn"
            to="/portfolio"
            tag="span"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-wallet</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Mein Portfolio</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link
            v-if="loggedIn"
            to="/profil"
            tag="span"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-wrench</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Mein Profil</v-list-item-title>
            </v-list-item>
          </router-link>

          <v-list-item
            color="accent"
            @click="loggedIn = !loggedIn"
          >
            <v-list-item-icon>
              <v-icon>mdi-run</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ loggedIn ? 'Abmelden' : 'Anmelden' }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data: () => ({
    drawer: false,
    loggedIn: false,
  }),
};
</script>

<style scoped>
    .clickable {
        cursor: pointer
    }
</style>
