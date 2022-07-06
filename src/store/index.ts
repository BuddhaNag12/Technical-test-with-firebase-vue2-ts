import Vue from "vue";
import Vuex from "vuex";
import { app } from "@/db";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";
const storage = getStorage();
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const firestore = getFirestore(app);
import {
  SET_USER,
  GET_USER,
  SET_TOKEN,
  SET_ERROR,
  SET_DOCUSER,
  SET_AVATAR_DATA,
  SET_AVATAR_URL,
  SET_LOADING,
  SET_USER_LOADING,
  SET_LOGGED_IN,
  SET_PASSWORD,
} from "../store/constants";
import { State } from "@/store/types";
Vue.use(Vuex);

export default new Vuex.Store({
  state(): State {
    return {
      user: null,
      token: "",
      error: "",
      docUser: {
        about: "",
        country: "",
        dob: "",
        email: "",
        firstName: "",
        gender: "",
        lastName: "",
        phone: "",
        state: "",
        urtRank: "",
        usrtRank: "",
        zipCode: "",
      },
      docAvatar: {
        primaryPrice: "",
        secondaryPrice: "",
        url: "",
      },
      password: "",
      confirmPassword: "",
      isLoggedIn: false,
      isLoading: false,
      isUserLoading: false,
      noDocUserData: false,
    };
  },
  mutations: {
    [SET_USER](state: State, payload: User) {
      state.user = payload;
    },
    [SET_TOKEN](state, payload) {
      state.token = payload;
    },
    [SET_ERROR](state, payload) {
      state.error = payload;
    },
    [SET_DOCUSER](state, payload) {
      state.docUser = payload;
    },
    [SET_AVATAR_DATA](state, payload) {
      state.docAvatar = payload;
    },
    [SET_AVATAR_URL](state, payload) {
      state.docAvatar.url = payload;
    },
    [SET_PASSWORD](state, payload) {
      state.password = payload.password;
      state.confirmPassword = payload.confirmPassword;
    },
    [SET_LOADING](state, payload) {
      state.isLoading = payload;
    },
    [SET_USER_LOADING](state, payload) {
      state.isUserLoading = payload;
    },
    [SET_LOGGED_IN](state, payload) {
      state.isLoggedIn = payload;
    },
  },
  actions: {
    setUser({ commit }, payload) {
      commit(SET_USER, payload);
    },
    signInWithGoogle({ commit }) {
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          // const user = result.user;
          commit(SET_TOKEN, token);
        })
        .catch((error) => {
          // Handle Errors here.
          console.log(error);
          // const errorCode = error.code;
          const errorMessage = error.message;
          if (errorMessage === "Firebase: Error (auth/popup-closed-by-user).") {
            commit(SET_ERROR, "Popup closed by user");
          }
        });
    },
    async signUserOut({ commit }) {
      await signOut(auth)
        .then(() => {
          commit(SET_USER, null);
          commit(SET_DOCUSER, null);
          commit(SET_AVATAR_DATA, null);
          commit(SET_LOGGED_IN, false);
        })
        .catch((error) => {
          commit(SET_ERROR, "Oops an error occured");
          // An error happened.
        });
    },
    autoSignIn({ commit }, payload) {
      commit(SET_USER, payload);
      commit("SET_LOGGED_IN", true);
    },
    // update apis
    async updateUserData({ commit }, { uid, payload }) {
      commit(SET_LOADING, true);
      try {
        await setDoc(doc(firestore, "users", uid), { ...payload });
      } catch (error) {
        console.log(error);
      } finally {
        commit(SET_LOADING, false);
      }
    },
    async updatePassword({ commit, state }) {
      commit(SET_LOADING, true);
      try {
        await setDoc(doc(firestore, "password", state.user?.uid || ""), {
          password: state.password,
          confirmPassword: state.confirmPassword,
        });
      } catch (error) {
        console.log(error);
      } finally {
        commit(SET_LOADING, false);
      }
    },
    async updateAvatarData({ commit }, { uid, payload }) {
      commit(SET_LOADING, true);
      try {
        await setDoc(doc(firestore, "avatar", uid), { ...payload });
      } catch (error) {
        console.log(error);
      } finally {
        commit(SET_LOADING, false);
      }
    },
    // Get apis
    async getPassword({ commit, state }) {
      commit(SET_LOADING, true);
      try {
        const id = state?.user?.uid || "";
        const avatarCollection = doc(firestore, "password", id);
        const docRef = await getDoc(avatarCollection);
        if (docRef.exists()) {
          commit(SET_PASSWORD, docRef.data());
        }
      } catch (error) {
        console.log(error);
      } finally {
        commit(SET_LOADING, false);
      }
    },
    async getAvatarCollection({ commit, state }) {
      commit(SET_LOADING, true);
      try {
        const id = state?.user?.uid || "";
        const avatarCollection = doc(firestore, "avatar", id);
        const docRef = await getDoc(avatarCollection);
        if (docRef.exists()) {
          commit(SET_AVATAR_DATA, docRef.data());
        }
      } catch (error) {
        console.log(error);
      } finally {
        commit(SET_LOADING, false);
      }
    },
    async getUserCollections({ commit, dispatch, state }) {
      commit(SET_USER_LOADING, true);
      dispatch("getPassword");
      try {
        const id = state?.user?.uid || "";
        const userCollection = doc(firestore, "users", id);
        const docRef = await getDoc(userCollection);
        if (docRef.exists()) {
          commit(SET_DOCUSER, docRef.data());
        } else {
          state.noDocUserData = true
        }
      } catch (error) {
        console.log(error);
      } finally {
        commit(SET_USER_LOADING, false);
      }
    },
    uploadFile({ commit, state }, { file }) {
      const type = file.type;
      const ext = type.split("/")[1];
      const id = state.user?.uid || "";
      const avatarRef = ref(storage, `avatar/${id}.${ext}`);
      const metadata = {
        contentType: type,
      };
      commit(SET_LOADING, true);
      const uploadTask = uploadBytes(avatarRef, file, metadata);
      uploadTask
        .then(({ metadata }) => {
          const bucketPath = `https://firebasestorage.googleapis.com/v0/b/auth-sys-caaea.appspot.com/o/avatar%2F${
            metadata.fullPath.split("/")[1]
          }?alt=media`;
          setDoc(
            doc(firestore, "avatar", id),
            { url: bucketPath },
            {
              merge: true,
            }
          );
          commit(SET_AVATAR_URL, bucketPath);
        })
        .catch((err) => {
          commit(SET_ERROR, err || "Oops an error occured");
        })
        .finally(() => {
          commit(SET_LOADING, false);
        });
    },
  },
  getters: {
    [GET_USER](state: State) {
      return state.user;
    },
    getError(state: State) {
      return state.error;
    },
  },
});
