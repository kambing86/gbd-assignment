import { createModel } from "@rematch/core";
import { StarWarsPerson } from "types/StarWarsPeople";
import { RootModel } from ".";

type User = {
  username: string;
  isAdmin: boolean;
};

type UserState = {
  user: User | undefined;
  person: StarWarsPerson | null;
  personIsLoading: boolean;
};

const initialState: UserState = {
  user: undefined,
  person: null,
  personIsLoading: false,
};

export default createModel<RootModel>()({
  state: initialState,
  reducers: {
    setUser(state, payload: User | undefined) {
      const user = payload;
      state.user = user;
      return state;
    },
    getDataPending(state) {
      state.person = null;
      state.personIsLoading = true;
      return state;
    },
    getDataFulFilled(state, payload: StarWarsPerson) {
      state.person = payload;
      state.personIsLoading = false;
      return state;
    },
  },
  effects: (dispatch) => ({
    async getData(payload: number) {
      dispatch.user.getDataPending();
      const request = await fetch(`http://swapi.dev/api/people/${payload}/`);
      const person = (await request.json()) as StarWarsPerson;
      dispatch.user.getDataFulFilled(person);
    },
  }),
});
