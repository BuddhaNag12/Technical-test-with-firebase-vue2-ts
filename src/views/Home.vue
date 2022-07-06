<template>
  <div
    class="d-flex justify-center align-center"
    style="width: 100%; height: 100vh"
  >
    <div class="d-fles flex-row">
      <v-btn class="ma-2" outlined color="indigo" @click="login"
        ><GoogleIcon /> Register with Google</v-btn
      >

      <v-alert type="error" v-if="getError">{{ getError }}</v-alert>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from "vuex";
import GoogleIcon from "@/assets/google.vue";
export default {
  name: "Home",
  components: {
    GoogleIcon,
  },
  computed: {
    ...mapGetters(["getError"]),
  },
  methods: {
    ...mapActions(["signInWithGoogle"]),
    login(): void {
      this.signInWithGoogle();
    },
  },
};
</script>
