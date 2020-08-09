<template>
  <div>
    <v-alert
      v-for="item in alerts"
      :key="item.key"
      :color="item.color"
      :dismissible="item.dismissible"
      border="bottom"
      elevation="10"
    >
      {{ item.text }}
    </v-alert>

    <v-snackbar
      v-for="item in snackbars"
      :key="item.key"
      v-model="item.show"
      :color="item.color"
      :timeout="0"
      top
      class="mt-12"
      app
    >
      {{ item.text }}

      <v-btn
        text
        @click="item.show = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import EventBus from '@/utils/eventBus';

export default {
  name: 'MyAlertSystem',
  data() {
    return {
      alerts: [],
      snackbars: [],
    };
  },
  mounted() {
    EventBus.$on('new-alert', (text, theme, duration, dismissible) => {
      this.newAlert(text, theme, duration, dismissible);
    });
    EventBus.$on('new-snackbar', (text, theme, duration, dismissible) => {
      this.newSnackbar(text, theme, duration, dismissible);
    });
  },
  methods: {
    newAlert(text, color, duration, dismissible) {
      const tmp = {
        key: this.uuid4(),
        text,
        color,
        dismissible,
      };
      this.alerts.push(tmp);
      if (duration) {
        setTimeout((key) => {
          this.alerts = this.alerts.filter((alert) => alert.key !== key);
        }, duration, tmp.key);
      }
    },
    newSnackbar(text, color, duration, dismissible) {
      const tmp = {
        key: this.uuid4(),
        text,
        color,
        dismissible,
        show: true,
      };
      this.snackbars.push(tmp);
      if (duration) {
        setTimeout((key) => {
          this.snackbars = this.snackbars.filter((snackbar) => snackbar.key !== key);
        }, duration, tmp.key);
      }
    },

    uuid4() {
      // eslint-disable-next-line no-bitwise, no-mixed-operators
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    },
  },
};
</script>

<style scoped>

</style>
