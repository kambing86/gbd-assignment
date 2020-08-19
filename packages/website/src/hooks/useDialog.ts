import create from "zustand";
import shallow from "zustand/shallow";

interface Store {
  isOpen: boolean;
  title: string;
  description: string;
  open: (title: string, description: string) => void;
  close: () => void;
}

const useStore = create<Store>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  open: (title, description) => set({ isOpen: true, title, description }),
  close: () => set({ isOpen: false }),
}));

const dispatchSelector = (store: Store) => ({
  open: store.open,
  close: store.close,
});

export const useSetDialog = () => {
  return useStore(dispatchSelector, shallow);
};

export const useGetDialog = () => {
  return useStore();
};
