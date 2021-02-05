import { createModel } from "@rematch/core";
import { RootModel } from ".";

type DialogState = {
  isOpen: boolean;
  title: string;
  description: string;
};
const initialState: DialogState = {
  isOpen: false,
  title: "",
  description: "",
};

type OpenPayload = { title: string; description: string };

export default createModel<RootModel>()({
  state: initialState,
  reducers: {
    open(state, payload: OpenPayload) {
      const { title, description } = payload;
      state.isOpen = true;
      state.title = title;
      state.description = description;
      return state;
    },
    close(state) {
      state.isOpen = false;
      return state;
    },
  },
});
