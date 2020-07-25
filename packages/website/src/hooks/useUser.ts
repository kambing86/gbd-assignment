import { atom, useRecoilState } from "recoil";

export interface User {
  username: string;
  isAdmin: boolean;
}

const USER_KEY = "user";

const userState = atom<User | undefined>({
  key: USER_KEY,
  default: undefined,
});

export const useUser = () => {
  return useRecoilState(userState);
};
