import { configureStore } from "@reduxjs/toolkit";
import authorizationSlice from "./slice/authorizationSlice";
import searchSlice from "./slice/searchSlice";
import searchResultsSlice from "./slice/searchResultsSlice";

export const store = configureStore({
  reducer: {
    authorization: authorizationSlice,
    search: searchSlice,
    searchResults: searchResultsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;