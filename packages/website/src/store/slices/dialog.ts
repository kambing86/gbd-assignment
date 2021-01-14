import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    open(state, action: PayloadAction<OpenPayload>) {
      const { title, description } = action.payload;
      state.isOpen = true;
      state.title = title;
      state.description = description;
    },
    close(state) {
      state.isOpen = false;
    },
  },
});

export default dialogSlice.reducer;
