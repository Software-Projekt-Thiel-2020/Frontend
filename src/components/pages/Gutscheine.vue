<template>
  <div>
    <v-container>
      <h1>Gutscheine kaufen</h1>
    </v-container>
    <v-container>
      <h3>Suche nach Betrieben in deiner Nähe!</h3>
    </v-container>
    <form class="container">
      <div>
        <label for="name">
          <v-icon style="color: black;"> mdi-magnify </v-icon>
        </label>
        <input
          id="name"
          type="text"
          placeholder="Name des Betriebs"
        >
      </div>
      <div>
        <label for="ort">
          <v-icon style="color: black;"> mdi-magnify </v-icon>
        </label>
        <input
          id="ort"
          type="text"
          placeholder="Stadt/PLZ"
        >
      </div>
      <input
        class="submit"
        type="submit"
        value="Suchen"
      >
    </form>
    <v-container>
      <h2>Ergebnisse:</h2>
    </v-container>
    <v-container class="results">
      <div
        v-for="item in items"
        :key="item.name"
        class="project"
      >
        <img src="../../assets/placeholder.png">
        <div
          class="companyData"
          style="border:0;"
        >
          <h2>Firmenname: {{ item.name }}</h2>
          <h3>Straße: {{ item.strasse }} {{ item.nummer }}</h3>
          <h3>PLZ und Ort: {{ item.plz }} {{ item.ort }}</h3>
          <h4>
            Zur Website:
            <a :href="item.website">{{ item.website }}</a>
          </h4>
        </div>
        <router-link :to="'project/'+item.id">
          <v-btn class="gutscheinButton">
            <h2 style="text-align:center">
              Gutschein kaufen
            </h2>
          </v-btn>
        </router-link>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Gutscheine',
  data: () => ({
    items: [
      {
        id: 1,
        name: 'Edeka',
        strasse: 'Müllerstrasse',
        nummer: 1,
        plz: 32257,
        ort: 'Bünde',
        website: 'https://www.edeka.de/',
      },
      {
        id: 2,
        name: 'ALDI',
        strasse: 'Müllerstrasse',
        nummer: 1,
        plz: 32257,
        ort: 'Bünde',
        website: 'https://www.google.com/',
      },
      {
        id: 3,
        name: 'LIDL',
        strasse: 'Müllerstrasse',
        nummer: 1,
        plz: 32257,
        ort: 'Bünde',
        website: 'https://www.google.com/',
      },
      {
        id: 4,
        name: 'REWE',
        strasse: 'Müllerstrasse',
        nummer: 1,
        plz: 32257,
        ort: 'Bünde',
        website: 'https://www.google.com/',
      },
      {
        id: 5,
        name: 'Penny',
        strasse: 'Müllerstrasse',
        nummer: 1,
        plz: 32257,
        ort: 'Bünde',
        website: 'https://www.google.com/',
      },
    ],
  }),
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}
.container div {
  border: 1px solid black;
  margin-right: 50px;
  border-radius: 3px;
}

.submit {
  background-color: #c4b3b0;
  width: 100px;
  font-weight: bold;
  border-radius: 3px;
  border: 1px solid black;
}

.results {
  display: flex;
  flex-direction: column;
}

.project {
  display: flex;
  flex-direction: row;
  margin-bottom: 25px;
}

.gutscheinButton {
  align-self: flex-end;
  margin-bottom:15px;
  margin-right: 15px;
}

.companyData {
  margin-left: 15px;
  flex-basis:55%
}
</style>
