import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

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

export const useDialog = () => {
  const [state, setState] = useRecoilState(dialogState);
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
  return { state, open, close };
};
