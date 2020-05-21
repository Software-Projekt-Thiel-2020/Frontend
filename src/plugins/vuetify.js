import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#3f51b5',
        secondary: '#2196f3',
        accent: '#00bcd4',
        error: '#f44336',
        warning: '#ff9800',
        info: '#03a9f4',
        success: '#4caf50',
      },
    },
  },
});
