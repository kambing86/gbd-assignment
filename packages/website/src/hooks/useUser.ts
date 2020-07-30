import { atom, useRecoilValue, useSetRecoilState } from "recoil";

interface User {
  username: string;
  isAdmin: boolean;
}

const USER_KEY = "user";

const userState = atom<User | undefined>({
  key: USER_KEY,
  default: undefined,
});

export const useGetUser = () => {
  return useRecoilValue(userState);
};

export const useSetUser = () => {
  return useSetRecoilState(userState);
};
