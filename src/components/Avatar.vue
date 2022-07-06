<template>
  <v-col cols="12" sm="4">
    <v-hover v-slot="{ hover }">
      <v-avatar width="313px" height="313px" style="cursor: pointer">
        <v-overlay absolute :value="hover">
          <v-btn
            color="success"
            class="font-weight-black"
            @click="$refs.fileInput.click()"
            >Chose file</v-btn
          >
        </v-overlay>
        <v-img
          v-if="avatarData && avatarData.url"
          :src="avatarData.url"
        ></v-img>
        <v-img
          v-else-if="$store.state.user"
          :src="$store.state.user.photoURL"
        ></v-img>
      </v-avatar>
    </v-hover>
    <v-card class="pa-2 mt-5" outlined tile max-width="313" min-height="140">
      <div class="d-flex align-end justify-end">
        <v-icon small dense right @click="dialog = true"> mdi-wrench </v-icon>
      </div>
      <v-card-text class="text-center">
        <div>Individual Prices For Private Lessons</div>
      </v-card-text>
      <v-card-text class="d-flex justify-space-between">
        <p>Jack Sparrow</p>
        <span>
          {{
            avatarData.primaryPrice ? "$" + avatarData.primaryPrice : "-"
          }}</span
        >
      </v-card-text>
      <v-card-text class="d-flex justify-space-between">
        <p>Tom Kruise</p>
        <span>
          {{
            avatarData.secondaryPrice ? "$" + avatarData.secondaryPrice : "-"
          }}</span
        >
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> Edit </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="avatarData.primaryPrice"
              label="Jack Sparrow"
              type="number"
              :rules="requiredRule"
              required
            ></v-text-field>
            <v-text-field
              v-model="avatarData.secondaryPrice"
              label="Tom Kruise"
              type="number"
              :rules="requiredRule"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="danger" text @click="cancel"> Cancel </v-btn>
          <v-btn color="success" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <input type="file" ref="fileInput" v-show="0" @change="uploadAvatar" />
  </v-col>
</template>

<script lang="ts">
import { DocUser } from "@/store/types";
type avatarTypes = {
  dialog: boolean;
  valid: boolean;
  reload: boolean;
  requiredRule: Array<any>;
};
export default {
  name: "avatar",
  props: {
    imgUrl: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "John",
    },
  },
  data(): avatarTypes {
    return {
      dialog: false,
      valid: false,
      reload: true,
      requiredRule: [(v: boolean) => !!v || "Field is required"],
    };
  },
  watch: {
    "$store.state.docAvatar.url"() {
      console.log("reload");
      this.reload = false;
      this.$nextTick(() => {
        this.reload = true;
      });
    },
  },
  computed: {
    avatarData(): DocUser {
      return this.$store.state.docAvatar || "";
    },
  },
  methods: {
    cancel(): void {
      this.dialog = false;
    },
    save(): void {
      if (this.valid) {
        this.$store.dispatch("updateAvatarData", {
          uid: this.$store.state.user.uid,
          payload: this.avatarData,
        });
        this.dialog = false;
      }
    },
    uploadAvatar(e: any): void {
      if (e.target.files.length) {
        const file = e.target.files[0];
        this.$store.dispatch("uploadFile", { file });
      }
    },
  },
};
</script>

<style></style>
