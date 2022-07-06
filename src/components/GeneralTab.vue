<template>
  <v-form class="mt-5" v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <label for="fname">First Name *</label>
          <v-text-field
            id="fname"
            v-model="userData.firstName"
            label="First Name"
            required
            outlined
            dense
            single-line
            :rules="requiredRule"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <label for="lname">Last Name *</label>
          <v-text-field
            id="lname"
            label="Last name"
            v-model="userData.lastName"
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
          <label for="email">Email *</label>
          <v-text-field
            id="email"
            label="Email"
            type="email"
            v-model="userData.email"
            required
            outlined
            dense
            single-line
            prepend-inner-icon="mdi-email"
            :rules="emailRules"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <label for="phone">Phone *</label>
          <v-text-field
            id="phone"
            label="Phone"
            type="number"
            v-model="userData.phone"
            outlined
            dense
            single-line
            prepend-inner-icon="mdi-phone"
            :rules="requiredRule"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <span>Date Of Birth *</span>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="userData.dob"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="userData.dob"
                prepend-inner-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
                outlined
                single-line
                dense
                :value="userData.dob"
                :rules="requiredRule"
                placeholder="DD/MM/YYYY"
                type="text"
                required
              ></v-text-field>
            </template>
            <v-date-picker v-model="userData.dob" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(userData.dob)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="6">
          <div class="d-flex justify-space-around mt-8">
            <strong v-if="getAge"
              >Age
              <span class="grey--text">{{ getAge }}</span>
            </strong>
            <v-chip v-if="getAge > 18" outlined>Adult 18+</v-chip>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <label for="gender">Select Your Gender</label>
          <v-radio-group v-model="userData.gender" row id="gender">
            <v-radio label="Male" value="male"></v-radio>
            <v-radio label="Female" value="female"></v-radio>
            <v-radio label="Other" value="other"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <label for="gender">About Me</label>
          <v-textarea
            outlined
            full-width
            placeholder="Text here"
            v-model="userData.about"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="userData.country"
            :items="countries"
            label="Country *"
            item-text="name"
            item-value="name"
            dense
            outlined
            :rules="requiredRule"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="userData.state"
            :items="states"
            label="State"
            dense
            outlined
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-text-field
            label="Zip Code"
            placeholder="Zip Code"
            outlined
            v-model="userData.zipCode"
            dense
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            label="URT Ranking"
            placeholder="URT Ranking"
            outlined
            dense
            v-model="userData.urtRank"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="USRT Ranking"
            placeholder="USRT Ranking"
            outlined
            dense
            v-model="userData.usrtRank"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-btn color="primary" width="148px" @click="updateUser">Save</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import moment from "moment";
import country from "../locations/country";
import states from "../locations/states";
export default {
  name: "generalTab",
  props: {
    userDataProp: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      menu: false,
      countries: country,
      states: states,
      valid: false,
      requiredRule: [(v) => !!v || "Field is required"],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  computed: {
    getAge() {
      return this.userData.dob
        ? moment().diff(moment(this.userData.dob), "years")
        : "";
    },
    userData: {
      get() {
        return this.userDataProp;
      },
      set(v) {
        this.$emit("update:userData", v);
      },
    },
  },
  methods: {
    updateUser() {
      if (this.valid) {
        this.$emit("updateUser");
      }
    },
  },
};
</script>

<style></style>
