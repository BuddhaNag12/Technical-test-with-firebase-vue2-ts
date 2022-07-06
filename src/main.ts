import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "@babel/polyfill";
import { app } from "@/db";
import { getAuth } from "firebase/auth";
const auth = getAuth(app);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch("autoSignIn", user);
        this.$store.dispatch("getUserCollections");
        this.$store.dispatch("getAvatarCollection");
        if (this.$route.fullPath !== "/user") {
          this.$router.replace({
            path: "/user",
          });
        }
      } else {
        if (this.$route.fullPath !== "/") {
          this.$router.replace("/");
        }
      }
    });
  },
}).$mount("#app");
