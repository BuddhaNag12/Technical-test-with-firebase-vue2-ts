<template>
  <v-form class="mt-5" v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <label for="password">Password *</label>
          <v-text-field
            id="password"
            v-model="$store.state.password"
            label="Password"
            required
            outlined
            dense
            single-line
            :rules="requiredRule"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <label for="cpassword">Confirm Password *</label>
          <v-text-field
            id="cpassword"
            v-model="$store.state.confirmPassword"
            label="Password"
            required
            outlined
            dense
            single-line
            :rules="[passwordRule, ...requiredRule]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-btn color="primary" width="148px" @click="save">Save</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      requiredRule: [(v) => !!v || "Field is required"],
    };
  },
  computed: {
    passwordRule() {
      return () =>
        this.password === this.confirmPassword || "Password must match";
    },
  },
  methods: {
    save() {
      if (this.valid) {
        this.$store.dispatch("updatePassword");
      }
    },
  },
};
</script>

<style></style>
