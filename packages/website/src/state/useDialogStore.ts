import { create } from "state";
import shallow from "zustand/shallow";

type Store = {
  isOpen: boolean;
  title: string;
  description: string;
  open: (title: string, description: string) => void;
  close: () => void;
};

const useStore = create<Store>(
  (set) => ({
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
  }),
  "dialog",
);

const stateSelector = ({ isOpen, title, description }: Store) => ({
  isOpen,
  title,
  description,
});

export const useGetDialog = () => {
  return useStore(stateSelector, shallow);
};

export const { open, close } = useStore.getState();
