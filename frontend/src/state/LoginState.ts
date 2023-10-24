import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const LoginState = atom<Boolean>({
  key: "LoginState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const LoginUser = atom<String>({
  key: "LoginUser",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
