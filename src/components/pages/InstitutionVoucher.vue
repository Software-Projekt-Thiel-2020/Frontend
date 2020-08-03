<template>
  <div class="gradientBackground">
    <v-container>
      <h4
        class="ma-5 display-1 text-center font-weight-medium white--text"
      >
        Eingestellte Gutscheine
      </h4>
      <v-btn
        class="addVoucher"
        @click="openDialog"
      >
        <v-icon class="plus">
          mdi-plus-thick
        </v-icon>
      </v-btn>
      <v-divider class="mt-5" />
      <v-layout
        v-if="loadingVouchers == true"
        justify-center
      >
        <v-progress-circular
          :size="70"
          :width="7"
          color="green"
          indeterminate
          class="loadingCircle"
        />
      </v-layout>
      <div v-else>
        <v-row>
          <v-col
            v-for="voucher in vouchers"
            :key="voucher.id"
            cols="6"
          >
            <v-card
              elevation="7"
              class="py-6 text-center"
            >
              <v-row>
                <v-col>
                  <h3 class="headline">
                    {{ voucher.title }}
                  </h3>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="voucherData">
                  <h4>
                    Beschreibung:
                  </h4>
                  {{ voucher.subject }}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="voucherData">
                  <h4>
                    Preis:
                  </h4>
                  {{ getETHValue(voucher.price) }}€
                </v-col>
                <v-col class="voucherData">
                  <h4>
                    Gültigkeit:
                  </h4>
                  {{ voucher.validTime / 60 / 60 / 24 / 365 }} Jahr(e)
                </v-col>
              </v-row>
              <v-row>
                <v-col class="voucherData">
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
                <v-col class="voucherData">
                  <h4>
                    Verkauft:
                  </h4>
                  {{ voucher.amount }} mal verkauft
                </v-col>
              </v-row>
              <v-btn
                class="mt-2 btn-hover color-9"
                dark
                @click="editVoucher(voucher)"
              >
                <span v-if="!$vuetify.breakpoint.xsOnly"> Gutschein editieren </span> <span v-else> editieren </span>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="vouchers.length==0">
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
        <router-link
          to="/InstitutionEditieren"
          tag="span"
          class="link"
        >
          <v-btn
            class="mt-5"
            style="color: black"
          >
            Meine Institutionen
          </v-btn>
        </router-link>
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
                class="inputField"
                required
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
    <v-snackbar
      v-model="dialogVoucher.error"
      top
      color="error"
    >
      Gutscheine konnten nicht geladen werden {{ dialogVoucher.errorMessage }}
    </v-snackbar>
    <v-snackbar
      v-model="dialogEdit.error"
      top
      color="error"
    >
      Gutschein konnte nicht aktualisiert werden {{ dialogEdit.errorMessage }}
    </v-snackbar>
    <v-snackbar
      v-model="dialogEdit.success"
      top
      color="success"
    >
      Gutschein wurde aktualisiert
    </v-snackbar>
    <v-snackbar
      v-model="dialogAddVoucher.error"
      top
      color="error"
    >
      Gutschein konnte nicht erstellt werden {{ dialogAddVoucher.errorMessage }}
    </v-snackbar>
    <v-snackbar
      v-model="dialogAddVoucher.success"
      top
      color="success"
    >
      Gutschein wurde erstellt
    </v-snackbar>
    <v-snackbar
      v-model="dialogEth.error"
      top
      color="error"
    >
      Etherum Wechselkurs konnte nicht geladen werden {{ dialogEth.errorMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios';
import { userSession } from '../../userSession';

export default {
  name: 'InstitutionVoucher',
  data: () => ({
    userSession: null,
    userData: null,
    institutionId: null,
    vouchers: null,
    loadingVouchers: true,
    dialogVoucher: {
      errorMessage: '',
      error: false,
    },
    overlay: false,
    editItem: {},
    newValidTime: null,
    oldTime: null,
    newPrice: null,
    newAvailable: null,
    form: false,
    changingVoucher: false,
    dialogEdit: {
      errorMessage: '',
      error: false,
      success: false,
    },
    disabled: true,
    ethToEur: null,
    dialogEth: {
      error: false,
      errorMessage: '',
    },
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
    dialogAddVoucher: {
      errorMessage: '',
      error: false,
      success: false,
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
          this.dialogEth.errorMessage = err.toString();
          this.dialogEth.error = true;
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
          this.dialogVoucher.errorMessage = err.toString();
          this.dialogVoucher.error = true;
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
      } else if (this.newPrice < 0) {
        this.disabled = true;
      } else if ((this.newValidTime < 1 || this.newValidTime < this.oldTime) && this.newValidTime) {
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
        // eslint-disable-next-line no-control-regex
        (v) => /^([\u0000-\u00ff]_[0-9]_)*$/i.test(v) || 'Keine valide Beschreibung',
      ];
    },
    priceRules() {
      return [
        () => (this.newVoucher.price >= 0) || 'Kein valider Preis',
      ];
    },
    timeRulesNew() {
      return [
        () => (this.newVoucher.validTime > 0) || 'Keine valide Gültigkeit',
      ];
    },
    priceRulesEdit() {
      return [
        () => (this.newPrice >= 0) || 'Kein valider Preis',
      ];
    },
    timeRulesEdit() {
      return [
        () => (this.newValidTime > 0) || 'Keine valide Gültigkeit',
        () => (this.newValidTime >= this.oldTime) || 'Neue Gültigkeit darf nicht kleiner sein',
      ];
    },
    changeVoucher() {
      this.changingVoucher = true;
      const url = 'vouchers/institution';
      const headers = {
        idVoucher: this.editItem.id,
        idInstitution: this.institutionId,
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
        this.dialogEdit.success = true;
      }).catch((err) => {
        this.dialogEdit.error = true;
        this.dialogEdit.errorMessage = err.toString();
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
        this.dialogAddVoucher.success = true;
      }).catch((err) => {
        this.dialogAddVoucher.error = true;
        this.dialogAddVoucher.errorMessage = err.toString();
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
    .gradientBackground {
        background: rgb(255, 255, 255) linear-gradient(to right, rgb(199, 255, 212), rgb(176, 218, 255));
        height: 100%;
    }
    .voucherData {
    text-align: left;
    margin-left: 25px;
    }

    .voucherData h5 {
        font-style: italic;
    }

    .noVouchers {
        text-align: center;
        color: red;
    }

  .inputField ::placeholder{
    color: black!important;
    opacity: 1;
  }

  .addVoucher {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 10px;
      height: 10px;
  }

    .loadingCircle {
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .wrongInput {
    color: red;
  }
</style>
