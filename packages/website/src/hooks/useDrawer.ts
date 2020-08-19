import create from "zustand";

interface Store {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const useStore = create<Store>((set) => ({
  isOpen: true,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

const selector = (store: Store): [Store["isOpen"], Store["setIsOpen"]] => [
  store.isOpen,
  store.setIsOpen,
];

export const useDrawer = () => {
  return useStore(selector);
};
