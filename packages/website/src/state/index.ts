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
        const nextState = produce(partial) as (state: T) => T;
        set(nextState, false, actionName);
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
