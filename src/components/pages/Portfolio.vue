<template>
  <div>
    <v-container class="container">
      <h1>Mein Portfolio</h1>
    </v-container>
    <v-container class="container">
      <v-row>
        <v-col
          id="spenden"
          class="text-left"
          cols="6"
        >
          <h1>Meine Spenden</h1>
          <div class="results">
            <div
              v-for="donation in donations"
              :key="donation.name"
              class="project"
            >
              <img
                class="picture"
                src="../../assets/placeholder.png"
                alt="placeholder"
              >
              <div
                class="companyData"
                style="border:0;"
              >
                <h2>Firmenname: {{ donation.name }}</h2>
                <h3>Gespendete Summe: {{ donation.amount }}€</h3>
                <h3>Datum: {{ donation.date }}</h3>
                <h4>
                  Zur Website:
                  <a :href="donation.website">{{ donation.website }}</a>
                </h4>
              </div>
            </div>
          </div>
        </v-col>

        <v-col
          id="gutscheine"
          class="text-left"
          cols="6"
        >
          <h1>Meine Gutscheine</h1>
          <div class="results">
            <div
              v-for="coupon in coupons"
              :key="coupon.name"
              class="project"
            >
              <img
                class="picture"
                src="../../assets/placeholder.png"
                alt="placeholder"
              >
              <div
                class="companyData"
                style="border:0;"
              >
                <h2>Firmenname: {{ coupon.name }}</h2>
                <h3>Gutscheinwert: {{ coupon.worth }}€ </h3>
                <h3>Datum: {{ coupon.date }}</h3>
                <h4>
                  Zur Website:
                  <a :href="coupon.website">{{ coupon.website }}</a>
                </h4>
                <h4
                  v-if="coupon.available === false"
                  class="expired"
                >
                  (Gutschein bereits eingelöst)
                </h4>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Historie',
  data: () => ({
    donations: [
      {
        name: 'Edeka',
        website: 'https://www.edeka.de/',
        amount: 15,
        date: '05.07.1945',
      },
      {
        name: 'ALDI',
        website: 'https://www.google.com/',
        amount: 50,
        date: '29.03.2007',
      },
      {
        name: 'LIDL',
        website: 'https://www.google.com/',
        amount: 30,
        date: '17.05.1999',
      },
    ],
    coupons: [
      {
        name: 'REWE',
        website: 'https://www.google.com/',
        available: true,
        worth: 10,
        date: '27.12.0003',
      },
      {
        name: 'Penny',
        website: 'https://www.google.com/',
        available: false,
        worth: 20,
        date: '01.01.1050',
      },
    ],
  }),
};
</script>

<style scoped>
.results {
  display: flex;
  flex-direction: column;
}

.project {
  display: flex;
  flex-direction: row;
  margin-bottom: 25px;
  border: 1px solid black;
}

.companyData {
  margin-left: 15px;
  flex-basis:55%;
}

.picture {
  height: 200px;
}

.expired {
  color: #f95235;
}

.container {
  margin-left:25px;
}
</style>
