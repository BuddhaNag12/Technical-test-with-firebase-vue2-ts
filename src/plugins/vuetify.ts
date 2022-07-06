import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#205EFF",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#E0E0E0",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#DC2626",
      },
    },
  },
});
