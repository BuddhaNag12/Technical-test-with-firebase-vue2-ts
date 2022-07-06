<template>
  <v-container class="d-flex">
    <Avatar :name="userData.firstName" :imgUrl="imgUrl" />
    <!-- right content -->
    <v-col cols="12" sm="8">
      <v-tabs v-model="tab" background-color="transparent" color="primary">
        <v-tab v-for="item in items" :key="item">
          {{ item }}
        </v-tab>
        <v-btn
          class="mt-2"
          color="danger"
          elevation="0"
          text
          @click="signOutUser"
          >Log out <v-icon>mdi-logout</v-icon></v-btn
        >
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <GeneralTab
            v-model="userData"
            :userDataProp="userData"
            @updateUser="updateUser"
          />
        </v-tab-item>
        <v-tab-item>
          <PasswordTab />
        </v-tab-item>
      </v-tabs-items>
    </v-col>
    <v-overlay :value="$store.state.isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-snackbar
      v-model="snackbar"
      timeout="2000"
      color="success"
      right
      top
      shaped
      app
    >
      <v-alert type="success" dense class="ma-0 pa-0">Login success</v-alert>
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
          small
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Avatar from "@/components/Avatar.vue";
import GeneralTab from "@/components/GeneralTab.vue";
import PasswordTab from "@/components/PasswordTab.vue";
import { UserDataType, DocUser } from "@/store/types";
import { User } from "firebase/auth";
export default {
  components: {
    Avatar,
    GeneralTab,
    PasswordTab,
  },
  data(): UserDataType {
    return {
      userData: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        zipCode: "",
        urtRank: "",
        usrtRank: "",
        dob: "",
        gender: "",
        about: "",
        country: "",
        state: "",
      },
      imgUrl: "",
      tab: "",
      menu: false,
      items: ["General Information", "Change password"],
      snackbar: !!this.$store.state.isLoggedIn,
    };
  },
  watch: {
    "$store.state.isUserLoading": {
      handler(): void {
        this.initUser();
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    documentUserData(): DocUser {
      return this.$store.state.docUser;
    },
    googleUserData(): User {
      return this.$store.state.user;
    },
  },
  methods: {
    updateUser(): void {
      this.$store.dispatch("updateUserData", {
        uid: this.$store.state.user.uid,
        payload: this.userData,
      });
    },
    initUser(): void {
      if (!this.$store.state.noDocUserData) {
        this.userData = this.documentUserData;
      } else if (this.$store.state.user) {
        const {
          email,
          displayName = "",
          phoneNumber,
          photoURL,
        } = this.googleUserData;
        const [firstName, lastName] = displayName?.split(" ") || ["", ""];
        this.userData.firstName = firstName;
        this.userData.lastName = lastName;
        this.userData.email = email || "";
        this.userData.phone = phoneNumber || "";
        this.imgUrl = photoURL || "";
      }
    },
    async signOutUser(): Promise<void> {
      await this.$store.dispatch("signUserOut");
    },
  },
};
</script>

<style>
.v-text-field--outlined fieldset {
  border-color: rgba(10, 10, 10, 0.199) !important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
