import produce from "immer";
import createStore, {
  GetState,
  PartialState,
  State,
  StateCreator,
  StoreApi,
} from "zustand";
import { devtools } from "zustand/middleware";

export type ImmerSetState<T extends State> = (state: T) => T | void;
export type CustomSetState<T extends State> = (
  partial: Partial<T> | ImmerSetState<T>,
  actionName: string,
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
    (partial, actionName) => {
      if (typeof partial === "object") {
        set(partial, false, actionName);
      } else {
        const updater = produce(partial) as (state: T) => T;
        set(updater, false, actionName);
      }
    },
    get,
    api,
  );

export type Config<T extends State> = StateCreator<T, CustomSetState<T>>;

const create = <T extends State>(config: Config<T>, name: string) => {
  return createStore(devtools(immer(config), name));
};

export { create as createStore };
