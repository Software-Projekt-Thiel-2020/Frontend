<template>
  <div>
    <v-container>
      <h1>Spenden</h1>
    </v-container>
    <v-container>
      <h3>Suche nach Betrieben in deiner Nähe!</h3>
    </v-container>
    <form class="container">
      <div>
        <label for="name">
          <i class="fas fa-search"></i>
        </label>
        <input id="name" type="text" placeholder="Name des Betriebs" />
      </div>
      <div>
        <label for="name">
          <i class="fas fa-search"></i>
        </label>
        <input type="text" placeholder="Stadt/PLZ" />
      </div>
      <input class="submit" type="submit" value="Suchen" />
    </form>
    <v-container>
      <h2>Ergebnisse:</h2>
    </v-container>
    <v-container class="results">
      <div v-for="item in items" :key="item.name" class="project">
        <img src="../../assets/placeholder.png" />
        <div style="border:0; margin-left: 0.5cm; flex-basis:55%">
          <h2>Firmenname: {{item.name}}</h2>
          <h3>Straße: {{item.straße}} {{item.nummer}}</h3>
          <h3>PLZ und Ort: {{item.plz}} {{item.ort}}</h3>
          <h4>
            Zur Website:
            <a :href="item.website">{{item.website}}</a>
          </h4>
        </div>
        <v-btn style="align-self: flex-end; margin-bottom:0.5cm;">
          <h2 style="text-align:center">Spenden</h2>
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Spenden",
  data: () => ({
    items: [
      {
        name: "Edeka",
        straße: "Müllerstraße",
        nummer: 1,
        plz: 32257,
        ort: "Bünde",
        website: "https://www.edeka.de/"
      },
      {
        name: "ALDI",
        straße: "Müllerstraße",
        nummer: 1,
        plz: 32257,
        ort: "Bünde",
        website: "https://www.google.com/"
      },
      {
        name: "LIDL",
        straße: "Müllerstraße",
        nummer: 1,
        plz: 32257,
        ort: "Bünde",
        website: "https://www.google.com/"
      },
      {
        name: "REWE",
        straße: "Müllerstraße",
        nummer: 1,
        plz: 32257,
        ort: "Bünde",
        website: "https://www.google.com/"
      },
      {
        name: "Penny",
        straße: "Müllerstraße",
        nummer: 1,
        plz: 32257,
        ort: "Bünde",
        website: "https://www.google.com/"
      }
    ]
  })
};
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: row;
}
.container div {
  border: 1px solid black;
  margin-right: 1cm;
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
  margin-bottom: 1cm;
}
</style>