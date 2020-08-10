<template>
  <Default title="Über Uns">
    <v-card
      class="pa-5"
      color="rgba(241, 242, 255, 0.76)"
    >
      <!-- TEXT SECTION-->
      <v-row>
        <v-col>
          <h2 id="was_ist_spenderschlender">
            Was ist Spenderschlender
          </h2>
          <p class="text-left" />
          Wir wollen Unternehmern und Geschäftsinhabern in besonders schwierigen Zeiten (aktuell das Covid-19-Virus) eine Plattform bieten, auf der sie Spendenprojekte erstellen und Gutscheine für Ihre Artikel und Dienstleistungen verkaufen können, um die immensen Gewinneinbußen auszugleichen.
          Für Kunden bietet unsere Seite die Möglichkeit ihrem Lieblingsrestaurant mit einer Spende zu helfen, für das Kino um die Ecke schonmal Gutscheine zu kaufen oder einfach eine gute Tat zu leisten. Mit unserem transparenten Konzept können Sie sich sicher sein, dass am Ende das Geld da ankommt, wo es auch benötigt wird.<br>
          Unser Partner Blockstacks sorgt für eine sichere Authentifikation und bietet Ihnen gleichzeitig ein zentrales Konto für diverse andere Dienste im Internet.<br>
          <h2>Warum Sie uns vertrauen können</h2>
          <h3>Transparenz</h3>
          Um ein Maximum an Transparenz zu gewährleisten, verwenden wir eine Blockchain. Mit dieser ist es möglich, jede Transaktion nachzuverfolgen und sowohl den Empfänger als auch den überwiesenen Betrag einzusehen.<br>
          Ebenfalls können diese sogenannten Blöcke im nachhinein nicht verändert werden, da bei jeder neuen Aktion auf der Blockchain alle vorherigen Transaktionen abgeglichen werden.<br>
          <a href="https://www.cryptolist.de/was-ist-blockchain">Mehr zum Thema Blockchain (externer Link)</a>
          <h3>Ethereum</h3>
          Ethereum und die damit enthaltene Kryptowährung Ether basiert auf einer sog. Blockchain, ählich wie das bekannteste Beispiel Bitcoin. Im Gegensatz zu Bitcoin bietet Ethereum mehr als nur eine Kryptowährung, denn es können Smart Contracts, dezentrale Anwendungen und Initial Coin Offerings(ICOs), wie bei unserer Seite, verwendet werden.<br>
          Da eine Blockchain dezentral - also auf verschiedene Orte verteilt ( Gegensatz dazu ein zentraler Server) - arbeitet, werden auf jedem teilnehmenden Client alle Daten und Transaktionen gespeichert und ständig aktualisiert.<br>
          <a href="https://www.cryptolist.de/ethereum">Auch hier verweisen wir gerne zu einer ausführlichen Erklärung. (externer Link)</a>
        </v-col>
      </v-row>
      <br><br>
      <v-divider />


      <!--FAQ SECTION-->
      <h1>FAQ</h1>
      <br>
      <v-expansion-panels
        focusable
        accordion
        multiple
      >
        <v-expansion-panel class="mb-2">
          <v-expansion-panel-header>
            <span class="question">
              <span class="font-weight-bold">Q:</span>
              Behaltet ihr Geld ein?
            </span>
          </v-expansion-panel-header>
          <v-divider />
          <v-expansion-panel-content class="answerBox">
            <v-row>
              <div>
                <span class="font-weight-bold">A:</span>
              </div>
              <v-col class="pa-0 pl-1">
                Das gespendete Geld wird auf einem Konto zusammengeführt und nach erreichen eines zuvor festgelegten Meilensteines und dessen Validierung an den Spendensammler überwiesen.
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="mb-2">
          <v-expansion-panel-header>
            <span class="question">
              <span class="font-weight-bold">Q:</span>
              Wie kann ich ein Spendenprojekt erstellen?
            </span>
          </v-expansion-panel-header>
          <v-divider />
          <v-expansion-panel-content class="answerBox">
            <v-row>
              <div>
                <span class="font-weight-bold">A:</span>
              </div>
              <v-col class="pa-0 pl-1">
                Zuerst müssen Sie sich bei Blockstack registrieren und anschließend bei uns einloggen. Danach erstellen Sie einfach ein neues Spendenprojekt und schon kann es losgehen.
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="mb-2">
          <v-expansion-panel-header>
            <span class="question">
              <span class="font-weight-bold">Q:</span>
              Wie kann ich spenden?
            </span>
          </v-expansion-panel-header>
          <v-divider />
          <v-expansion-panel-content class="answerBox">
            <v-row>
              <div>
                <span class="font-weight-bold">A:</span>
              </div>
              <v-col class="pa-0 pl-1">
                Zuerst registrieren Sie sich bei uns oder loggen Sie sich ein. Wenn Sie bereits wissen, für wen Sie spenden möchten, können Sie ganz einfach danach suchen und dann eine Spende tätigen. Andernfalls können Sie mit den Filteroptionen Ihre Suche verfeinern und ein passendes Unternehmen oder eine Spendenaktion zu finden.
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </Default>
</template>

<script>
import Default from '../Default.vue';

export default {
  name: 'UeberUns',
  components: {
    Default,
  },
};
</script>

<style scoped>
    .answerBox {
        padding: 0 0 0 13px;
        font-size: 0.9375rem;
    }

</style>
