<template>
  <div
    style="height: 0"
  >
    <v-snackbar
      top
      app
      :value="updateExists"
      :timeout="0"
      color="orange darken-2"
      style="z-index: 1000"
    >
      Ein Update ist verfügbar.
      <v-btn
        text
        @click="refreshApp()"
      >
        Aktualisieren
      </v-btn>
    </v-snackbar>
    <v-snackbar
      top
      app
      :value="onlineNotification"
      :timeout="4000"
      color="success"
      style="z-index: 1000"
    >
      <span class="text-center"> Sie sind wieder online!</span>
    </v-snackbar>
    <v-dialog
      v-model="isOffline"
      no-click-animation
      max-width="400"
    >
      <v-card
        shaped
        elevation="8"
        max-width="400"
      >
        <v-card-title>
          <span class="text-center">Sie sind Offline</span>
        </v-card-title>
        <v-card-text class="text-left">
          Im Offline-Modus können Sie noch auf unsere Seite navigieren,
          aber keine Spenden tätigen oder sonstigen Aktivitäten nachgehen.
          Damit Sie den vollen Umfang von SpenderSchlender genießen können,
          gehen Sie bitte wieder online.
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// Datei in Anlehnung an 'https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip'

export default {
  name: 'ContentManager',
  data: () => ({
    refreshing: false,
    registration: null,
    updateExists: false,
    onlineNotification: false,
  }),
  mounted() {
    this.$on('online', () => {
      this.onlineNotification = true;
    });
  },
  created() {
    // Listen for our custom event from the SW registration
    document.addEventListener('swUpdated', this.updateAvailable, { once: true });
    // Prevent multiple refreshes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return;
      this.refreshing = true;
      // Here the actual reload of the page occurs
      window.location.reload();
    });
  },
  methods: {
    // Store the SW registration so we can send it a message
    // We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
    // To alert the user there is an update they need to refresh for
    updateAvailable(event) {
      this.registration = event.detail;
      this.updateExists = true;
    },
    // Called when the user accepts the update
    refreshApp() {
      this.updateExists = false;
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!this.registration || !this.registration.waiting) return;
      // send message to SW to skip the waiting and activate the new SW
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    },
  },
};
</script>

<style scoped>

</style>
