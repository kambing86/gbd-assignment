import { atom, useRecoilState } from "recoil";

const DRAWER_OPEN_KEY = "drawerOpen";

const drawerOpenState = atom<boolean>({
  key: DRAWER_OPEN_KEY,
  default: true,
});

export const useDrawer = () => {
  return useRecoilState(drawerOpenState);
};
