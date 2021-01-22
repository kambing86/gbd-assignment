import { createAsyncThunk } from "@reduxjs/toolkit";
import { StarWarsPeople } from "types/StarWarsPeople";

export const getData = createAsyncThunk("user/getData", async (id: number) => {
  const request = await fetch(`http://swapi.dev/api/people/${id}/`);
  return { id, data: (await request.json()) as StarWarsPeople };
});
