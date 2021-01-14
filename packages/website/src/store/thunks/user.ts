import { createAsyncThunk } from "@reduxjs/toolkit";

export const getData = createAsyncThunk("user/getData", async (id: number) => {
  const request = await fetch(`http://swapi.dev/api/people/${id}/`);
  return { id, data: await request.json() }; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
});
