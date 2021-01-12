import { Config, createStore } from "state";
import shallow from "zustand/shallow";

type DialogStore = {
  isOpen: boolean;
  title: string;
  description: string;
  open: (title: string, description: string) => void;
  close: () => void;
};

const dialogConfig: Config<DialogStore> = (set) => ({
  isOpen: false,
  title: "",
  description: "",
  open: (title, description) =>
    set(
      {
        isOpen: true,
        title: title,
        description: description,
      },
      "open",
    ),
  close: () => set({ isOpen: false }, "close"),
});

const useStore = createStore(dialogConfig, "dialog");

const stateSelector = ({ isOpen, title, description }: DialogStore) => ({
  isOpen,
  title,
  description,
});

export const useGetDialog = () => {
  return useStore(stateSelector, shallow);
};

export const { open, close } = useStore.getState();
