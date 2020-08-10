<template>
  <Default
    title="Eingestellte Gutscheine"
    :loading="loadingVouchers"
  >
    <v-layout
      class="mb-3"
      :justify-center="$vuetify.breakpoint.smAndDown"
      :class="!$vuetify.breakpoint.smAndDown ? 'btnTitleLeft' : ''"
    >
      <v-btn
        color="success"
        @click="openDialog"
      >
        Gutschein anlegen
      </v-btn>
    </v-layout>

    <v-container>
      <div>
        <v-row>
          <v-col
            v-for="voucher in vouchers"
            :key="voucher.id"
            cols="12"
            sm="12"
            md="6"
            lg="4"
            xl="3"
          >
            <MyCard>
              <template #title>
                {{ voucher.title }}
              </template>

              <template #subtitle>
                {{ voucher.subject }}
              </template>

              <template #text>
                <v-row>
                  <v-col>
                    <h4>
                      Preis:
                    </h4>
                    {{ getETHValue(voucher.price) }}€
                  </v-col>
                  <v-col>
                    <h4>
                      Gültigkeit:
                    </h4>
                    {{ voucher.validTime / 60 / 60 / 24 / 365 }} Jahr(e)
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <h4>
                      Verfügbarkeit:
                    </h4>
                    <div v-if="voucher.available">
                      Verfügbar
                    </div>
                    <div v-else>
                      Nicht verfügbar
                    </div>
                  </v-col>
                  <v-col>
                    <h4>
                      Verkauft:
                    </h4>
                    {{ voucher.amount }} mal verkauft
                  </v-col>
                </v-row>
              </template>

              <template #actions>
                <v-btn
                  color="rgba(0, 0, 0, 0.54)"
                  text
                  block
                  @click="editVoucher(voucher)"
                >
                  editieren
                </v-btn>
              </template>
            </MyCard>
          </v-col>
        </v-row>
        <v-row v-if="vouchers && vouchers.length === 0">
          <v-col class="noVouchers">
            <h3>
              Keine Gutscheine vorhanden
            </h3>
          </v-col>
        </v-row>
      </div>
      <v-layout
        justify-center
      >
        <v-btn
          to="/InstitutionEditieren"
          class="mt-5"
        >
          Meine Institutionen
        </v-btn>
      </v-layout>
      <v-container />
    </v-container>

    <v-dialog
      v-if="overlay"
      v-model="overlay"
      absolute
      persistent
    >
      <v-card>
        <v-layout
          justify-center
        >
          <v-card-title>
            Gutschein bearbeiten
          </v-card-title>
        </v-layout>
        <v-layout
          justify-center
        >
          <v-card-subtitle>
            Titel: {{ editItem.title }}
          </v-card-subtitle>
        </v-layout>
        <v-form>
          <v-row>
            <v-col cols="3" />
            <v-col cols="6">
              <v-text-field
                v-model="newPrice"
                :placeholder="editItem.price.toString()"
                type="number"
                label="Preis (in Wei)"
                class="inputField"
                :rules="priceRulesEdit()"
                @change="valuesChanged()"
              />
            </v-col>
            <v-col cols="3" />
          </v-row>
          <v-row>
            <v-col cols="3" />
            <v-col cols="6">
              <v-checkbox
                v-model="newAvailable"
                style="display:inline-flex"
                class="text-center align-center"
                label="Verfügbar"
                @change="valuesChanged()"
              />
            </v-col>
            <v-col cols="3" />
          </v-row>
          <v-row>
            <v-col cols="3" />
            <v-col cols="6">
              <v-text-field
                v-model="newValidTime"
                :placeholder="oldTime.toString()"
                type="number"
                label="Gültigkeit (in Jahren)"
                class="inputField"
                :rules="timeRulesEdit()"
                @change="valuesChanged()"
              />
            </v-col>
            <v-col cols="3" />
          </v-row>
          <v-card-actions
            class="ma-0 pa-0"
          >
            <v-btn-toggle
              borderless
              style="width: 50%"
            >
              <v-btn
                color="error"
                block
                tile
                @click="closeOverlay()"
              >
                Schließen
              </v-btn>
              <v-btn
                :disabled="disabled"
                color="success"
                block
                tile
                :loading="changingVoucher"
                @click="changeVoucher"
              >
                Bestätigen
              </v-btn>
            </v-btn-toggle>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="addVoucherOverlay"
      v-model="addVoucherOverlay"
      absolute
      persistent
    >
      <v-card>
        <v-layout
          justify-center
        >
          <v-card-title>
            Gutschein erstellen
          </v-card-title>
        </v-layout>
        <v-form
          v-model="newVoucher.form"
        >
          <v-row>
            <v-col cols="3" />
            <v-col cols="6">
              <v-text-field
                v-model="newVoucher.title"
                label="Titel"
                counter
                class="inputField"
                required
                :rules="titleRulesNew()"
              />
            </v-col>
            <v-col cols="3" />
          </v-row>
          <v-row>
            <v-col cols="3" />
            <v-col cols="6">
              <v-text-field
                v-model="newVoucher.price"
                type="number"
                label="Preis (in Wei)"
                class="inputField"
                required
                :rules="priceRules()"
              />
            </v-col>
            <v-col cols="3" />
          </v-row>
          <v-row>
            <v-col cols="3" />
            <v-col cols="6">
              <v-text-field
                v-model="newVoucher.subject"
                label="Beschreibung"
                class="inputField"
                :rules="subjectRules()"
                required
              />
            </v-col>
            <v-col cols="3" />
          </v-row>
          <v-row>
            <v-col cols="3" />
            <v-col cols="6">
              <v-text-field
                v-model="newVoucher.validTime"
                type="number"
                label="Gültigkeit (in Jahren)"
                class="inputField"
                required
                :rules="timeRulesNew()"
              />
            </v-col>
            <v-col cols="3" />
          </v-row>

          <v-card-actions
            class="ma-0 pa-0"
          >
            <v-btn-toggle
              borderless
              style="width: 50%"
            >
              <v-btn
                color="error"
                block
                tile
                @click="closeDialog()"
              >
                Schließen
              </v-btn>
              <v-btn
                :disabled="!newVoucher.price
                  || !newVoucher.title
                  || (newVoucher.title.length > 32)
                  || !newVoucher.subject
                  || !newVoucher.validTime
                  || !newVoucher.form"
                color="success"
                block
                tile
                :rules="priceRules"
                :loading="creatingVoucher"
                @click="createVoucher"
              >
                Bestätigen
              </v-btn>
            </v-btn-toggle>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </Default>
</template>

<script>
import axios from 'axios';
import { userSession } from '@/userSession';
import EventBus from '@/utils/eventBus';

import Default from '../Default.vue';
import MyCard from '../MyCard.vue';

export default {
  name: 'InstitutionVoucher',
  components: {
    Default,
    MyCard,
  },
  data: () => ({
    userSession: null,
    userData: null,
    institutionId: null,
    vouchers: null,
    loadingVouchers: true,
    overlay: false,
    editItem: {},
    newValidTime: null,
    oldTime: null,
    newPrice: null,
    newAvailable: null,
    form: false,
    changingVoucher: false,
    disabled: true,
    ethToEur: null,
    addVoucherOverlay: false,
    addVoucherDisabled: true,
    creatingVoucher: false,
    newVoucher: {
      price: null,
      title: '',
      subject: '',
      validTime: null,
      form: false,
    },
  }),
  created() {
    this.userSession = userSession;
    this.institutionId = this.$route.params.id;
  },
  mounted() {
    this.loadVouchers();
    if (userSession.isUserSignedIn()) {
      this.userData = userSession.loadUserData();
    }
    this.weiToEuro();
  },
  methods: {
    getETHValue(value) {
      if (value > 0) {
        return (value * this.ethToEur).toFixed(4).toString();
      }
      return null;
    },
    weiToEuro() {
      axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR')
        .then((res) => {
          this.ethToEur = res.data.EUR / 1e18;
        })
        .catch((err) => {
          EventBus.$emit('new-snackbar', `Etherum Wechselkurs konnte nicht geladen werden ${err.toString()}`, 'error', 10000, true);
        });
    },
    loadVouchers() {
      let url = 'vouchers/institution?idInstitution=';
      url += this.institutionId;
      axios.get(url)
        .then((res) => {
          this.vouchers = res.data;
        })
        .catch((err) => {
          EventBus.$emit('new-snackbar', `Gutscheine konnten nicht geladen werden ${err.toString()}`, 'error', 10000, true);
        }).finally(() => {
          this.loadingVouchers = false;
        });
    },
    editVoucher(voucher) {
      this.overlay = true;
      this.editItem = voucher;
      this.newAvailable = voucher.available;
      this.oldTime = (voucher.validTime / 60 / 60 / 24 / 365);
    },
    closeOverlay() {
      this.overlay = false;
      this.editItem = {};
      this.newValidTime = null;
      this.newAvailable = null;
      this.newPrice = null;
      this.disabled = true;
    },
    valuesChanged() {
      if (this.newValidTime === this.oldTime
        && this.newPrice === this.editItem.price
        && this.newAvailable === this.editItem.available) {
        this.disabled = true;
      } else if (!this.newValidTime && !this.newPrice && this.newAvailable === this.editItem.available) {
        this.disabled = true;
      } else if (this.newPrice < 0 || this.newPrice > 9e30) {
        this.disabled = true;
      } else if ((this.newValidTime < 1 || this.newValidTime < this.oldTime || this.newValidTime > 20) && this.newValidTime) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    openDialog() {
      this.addVoucherOverlay = true;
    },
    closeDialog() {
      this.addVoucherOverlay = false;
      this.newVoucher.title = '';
      this.newVoucher.subject = '';
      this.newVoucher.validTime = null;
      this.newVoucher.price = null;
    },
    subjectRules() {
      return [
        (v) => (this.validate(window.btoa(v))) || 'Beschreibung muss Base64 encodedierbar sein',
      ];
    },
    validate(str) {
      try {
        atob(str);
        return true;
      } catch (e) {
        return false;
      }
    },
    priceRules() {
      return [
        () => (this.newVoucher.price >= 0) || 'Kein valider Preis',
        () => (this.newVoucher.price <= 9e30) || 'Preis darf max. 9e30 sein',
        () => /^[0-9]+$/.test(this.newVoucher.price) || 'Bitte geben Sie eine ganze Zahl ein',
      ];
    },
    timeRulesNew() {
      return [
        () => /[0-9]+/.test(this.newVoucher.validTime) || 'Bitte geben Sie eine Zahl ein',
        () => (this.newVoucher.validTime > 0) || 'Ein Gutschein muss mind. 1 Jahr gültig sein',
        () => (this.newVoucher.validTime < 21) || 'Ein Gutschein kann max. 20 Jahre gültig sein',
      ];
    },
    priceRulesEdit() {
      return [
        () => (this.newPrice >= 0) || 'Kein valider Preis',
        () => (this.newPrice <= 9e30) || 'Preis darf max. 9e30 sein',
        () => /^[0-9]+$/.test(this.newPrice) || 'Bitte geben Sie eine ganze Zahl ein',
      ];
    },
    timeRulesEdit() {
      return [
        () => /[0-9]+/.test(this.newValidTime) || 'Bitte geben Sie eine Zahl ein',
        () => (this.newValidTime > 0) || 'Ein Gutschein muss mind. 1 Jahr gültig sein',
        () => (this.newValidTime < 21) || 'Ein Gutschein kann max. 20 Jahre gültig sein',
        () => (this.newValidTime >= this.oldTime) || 'Neue Zeit darf nicht kleiner sein',
      ];
    },
    titleRulesNew() {
      return [
        () => (this.newVoucher.title.length <= 32) || 'Der Titel darf maximal 32 Zeichen lang sein',
      ];
    },
    changeVoucher() {
      this.changingVoucher = true;
      const url = 'vouchers/institution';
      const headers = {
        idVoucher: this.editItem.id,
        idInstitution: this.institutionId,
        authToken: this.userData.authResponseToken,
      };
      if (this.newValidTime) {
        headers.validTimeVoucher = this.newValidTime * 365 * 24 * 60 * 60;
      }
      if (this.newPrice) {
        headers.priceVoucher = this.newPrice;
      }
      if (this.newAvailable) {
        headers.availableVoucher = 1;
      } else {
        headers.availableVoucher = 0;
      }

      axios.patch(url, {}, { headers }).then(() => {
        EventBus.$emit('new-snackbar', 'Gutschein wurde aktualisiert', 'success', 10000, true);
      }).catch((err) => {
        EventBus.$emit('new-snackbar', `Gutschein konnte nicht aktualisiert werden ${err.toString()}`, 'error', 10000, true);
      }).finally(() => {
        this.changingVoucher = false;
        this.closeOverlay();
        this.loadVouchers();
      });
    },
    createVoucher() {
      this.creatingVoucher = true;
      const url = 'vouchers/institution';
      const headers = {
        authToken: this.userData.authResponseToken,
        idInstitution: this.institutionId,
        price: this.newVoucher.price,
        title: this.newVoucher.title,
        subject: this.newVoucher.subject,
        validTime: this.newVoucher.validTime * 365 * 24 * 60 * 60,
      };
      axios.post(url, {}, { headers }).then(() => {
        EventBus.$emit('new-snackbar', 'Gutschein wurde erstellt', 'success', 10000, true);
      }).catch((err) => {
        EventBus.$emit('new-snackbar', `Gutschein konnte nicht erstellt werden ${err.toString()}`, 'error', 10000, true);
      }).finally(() => {
        this.creatingVoucher = false;
        this.closeDialog();
        this.loadVouchers();
      });
    },
  },
};

</script>


<style scoped>
  .noVouchers {
      text-align: center;
      color: red;
  }

  .inputField ::placeholder{
    color: black!important;
    opacity: 1;
  }
</style>
