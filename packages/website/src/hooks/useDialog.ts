import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

interface DialogState {
  open: boolean;
  title: string;
  description: string;
}

const DIALOG_KEY = "dialog";
const dialogState = atom<DialogState>({
  key: DIALOG_KEY,
  default: {
    open: false,
    title: "",
    description: "",
  },
});

export const useSetDialog = () => {
  const setState = useSetRecoilState(dialogState);
  const open = useCallback(
    (title: string, description: string) => {
      setState({
        open: true,
        title,
        description,
      });
    },
    [setState],
  );
  const close = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, [setState]);
  return { open, close };
};

export const useGetDialog = () => {
  const state = useRecoilValue(dialogState);
  return state;
};
