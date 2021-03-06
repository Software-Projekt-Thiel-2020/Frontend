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

    <MyDialog v-model="overlay">
      <template #title>
        Gutschein bearbeiten
      </template>
      <template #subtitle>
        Titel: {{ editItem.title }}
      </template>

      <template #text>
        <v-container>
          <v-form ref="voucher_edit_form">
            <MyFormRow title="Preis (in Wei)">
              <v-text-field
                v-model="newPrice"
                class="ma-0 pa-0 nospin"
                :placeholder="overlay ? editItem.price.toString() : ''"
                type="number"
                :rules="priceRulesEdit()"
                @change="valuesChanged()"
              />
            </MyFormRow>
            <MyFormRow title="Verfügbarkeit">
              <v-checkbox
                v-model="newAvailable"
                class="ma-0 pa-0"
                label="Verfügbar"
                @change="valuesChanged()"
              />
            </MyFormRow>
            <MyFormRow title="Gültigkeit (Jahre)">
              <v-text-field
                v-model="newValidTime"
                :placeholder="overlay ? oldTime.toString() : ''"
                type="number"
                class="ma-0 pa-0"
                :rules="timeRulesEdit()"
                @change="valuesChanged()"
              />
            </MyFormRow>
          </v-form>
        </v-container>
      </template>
      <template #actions>
        <v-row class="mx-0">
          <v-col>
            <v-btn
              color="error"
              block
              @click="closeOverlay()"
            >
              Schließen
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              :disabled="disabled"
              color="success"
              block
              :loading="changingVoucher"
              @click="changeVoucher"
            >
              Bestätigen
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </MyDialog>

    <MyDialog v-model="addVoucherOverlay">
      <template #title>
        Gutschein erstellen
      </template>

      <template #text>
        <v-container>
          <v-form
            v-model="newVoucher.form"
          >
            <MyFormRow title="Titel">
              <v-text-field
                v-model="newVoucher.title"
                class="ma-0 pa-0"
                :rules="titleRulesNew()"
                counter
                clearable
                required
              />
            </MyFormRow>
            <MyFormRow title="Preis (in Wei)">
              <v-text-field
                v-model="newVoucher.price"
                class="ma-0 pa-0 nospin"
                type="number"
                clearable
                required
                :rules="priceRules()"
              />
            </MyFormRow>
            <MyFormRow title="Beschreibung">
              <v-text-field
                v-model="newVoucher.subject"
                class="ma-0 pa-0"
                clearable
                required
                :rules="subjectRules()"
              />
            </MyFormRow>
            <MyFormRow title="Gültigkeit (Jahre)">
              <v-text-field
                v-model="newVoucher.validTime"
                class="ma-0 pa-0"
                type="number"
                clearable
                required
                :rules="timeRulesNew()"
              />
            </MyFormRow>
          </v-form>
        </v-container>
      </template>

      <template #actions>
        <v-row class="mx-0">
          <v-col>
            <v-btn
              color="error"
              block
              @click="closeDialog()"
            >
              Schließen
            </v-btn>
          </v-col>
          <v-col>
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
          </v-col>
        </v-row>
      </template>
    </MyDialog>
  </Default>
</template>

<script>
import axios from 'axios';
import { userSession } from '@/userSession';
import EventBus from '@/utils/eventBus';

import Default from '../Default.vue';
import MyCard from '../MyCard.vue';
import MyDialog from '../MyDialog.vue';
import MyFormRow from '../MyFormRow.vue';

export default {
  name: 'InstitutionVoucher',
  components: {
    MyFormRow,
    MyDialog,
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
    converToBigInt(value) {
      // eslint-disable-next-line no-undef
      return value === null ? value : BigInt(value);
    },
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
      this.editItem = voucher;
      this.newAvailable = voucher.available;
      this.oldTime = (voucher.validTime / 60 / 60 / 24 / 365);
      this.overlay = true;
    },
    closeOverlay() {
      this.overlay = false;
      this.editItem = {};
      this.newValidTime = null;
      this.newAvailable = null;
      this.newPrice = null;
      this.disabled = true;
      this.$refs.voucher_edit_form.resetValidation();
    },
    valuesChanged() {
      if (this.newValidTime === this.oldTime
        && this.converToBigInt(this.newPrice) === this.converToBigInt(this.editItem.price)
        && this.newAvailable === this.editItem.available) {
        this.disabled = true;
      } else if (!this.newValidTime && !this.newPrice && this.newAvailable === this.editItem.available) {
        this.disabled = true;
      } else if (this.converToBigInt(this.newPrice) < 0 || this.converToBigInt(this.newPrice) > 9e30) {
        this.disabled = true;
      } else this.disabled = !!((this.newValidTime < 1 || this.newValidTime < this.oldTime || this.newValidTime > 20) && this.newValidTime);
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
        () => (this.converToBigInt(this.newVoucher.price) <= 9e30) || 'Preis darf max. 9e30 sein',
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
        () => (this.converToBigInt(this.newPrice) <= 9e30) || 'Preis darf max. 9e30 sein',
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
        () => (this.newVoucher.title && this.newVoucher.title.length > 0) || 'Der Titel darf nicht leer sein',
        () => (this.newVoucher.title && this.newVoucher.title.length <= 32) || 'Der Titel darf maximal 32 Zeichen lang sein',
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
        EventBus.$emit('new-snackbar', `Gutschein konnte nicht aktualisiert werden ${err.toString()} - ${err.response.data.error}`, 'error', 10000, true);
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
        EventBus.$emit('new-snackbar', `Gutschein konnte nicht erstellt werden ${err.toString()} - ${err.response.data.error}`, 'error', 10000, true);
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

  .nospin ::v-deep input::-webkit-outer-spin-button,
  .nospin ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
