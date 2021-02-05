import { RematchDispatch, RematchRootState, init } from "@rematch/core";
import immerPlugin from "@rematch/immer";
import { RootModel, models } from "./models";

export const store = init<RootModel>({
  name: "gbd-assignment",
  models,
  // add immerPlugin to your store
  plugins: [immerPlugin()],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export const dispatch = store.dispatch;

export default store;
