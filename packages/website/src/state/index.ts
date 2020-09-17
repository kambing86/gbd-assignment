import produce from "immer";
import createStore, {
  GetState,
  PartialState,
  State,
  StateCreator,
  StoreApi,
} from "zustand";
import { devtools } from "zustand/middleware";

type ImmerSetState<T extends State> = (state: T) => T | void;
type CustomSetState<T extends State> = (
  set: Partial<T> | ImmerSetState<T>,
  name?: string,
) => void;
type NamedSet<S extends State> = (
  partial: PartialState<S>,
  replace?: boolean,
  name?: string,
) => void;

const immer = <T extends State>(config: StateCreator<T, CustomSetState<T>>) => (
  set: NamedSet<T>,
  get: GetState<T>,
  api: StoreApi<T>,
) =>
  config(
    (partial, name) => {
      if (typeof partial === "object") {
        set(partial, false, name);
      } else {
        const nextState = produce(partial) as (state: T) => T;
        set(nextState, false, name);
      }
    },
    get,
    api,
  );

export const create = <T extends State>(
  config: StateCreator<T, CustomSetState<T>>,
  name: string,
) => {
  return createStore(devtools(immer(config), name));
};
