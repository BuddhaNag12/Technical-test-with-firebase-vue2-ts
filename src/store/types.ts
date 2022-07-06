import { User } from "firebase/auth";
type DocUser = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  urtRank: string;
  usrtRank: string;
  dob: string;
  gender: string;
  about: string;
  country: string;
  state: string;
};
type DocAvatar = {
  primaryPrice: string;
  secondaryPrice: string;
  url: string;
};

type State = {
  user: User | null;
  token: string;
  error: string;
  docUser: DocUser;
  docAvatar: DocAvatar;
  isLoading: boolean;
  isLoggedIn: boolean;
  isUserLoading: boolean;
  password: string;
  confirmPassword: string;
  noDocUserData: boolean;
};

type UserDataType = {
  userData: DocUser;
  imgUrl: string;
  tab: string;
  menu: boolean;
  items: Array<string>;
  snackbar: boolean;
};

export { State, UserDataType, DocUser };
