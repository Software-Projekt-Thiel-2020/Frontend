<template>
  <v-container class="mt-12">
    <v-snackbar
      top
      app
      :value="updateExists"
      :timeout="0"
      color="primary"
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
    <p
      v-if="isOnline"
      class="offline"
    >
      This part will be visible only if user is online
    </p>
    <p v-if="isOffline">
      This part will be visible only if user is offline
    </p>
    <p>
      AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    </p>
  </v-container>
</template>

<script>
// File in Anlehnung an 'https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip'

export default {
  name: 'ContentManager',
  data: () => ({
    refreshing: false,
    registration: null,
    updateExists: false,
  }),
  mounted() {
    this.$on('offline', () => {
      alert('You are offline! The website will not work');
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
