import { createSlice } from "@reduxjs/toolkit/react";
import type { SearchState } from "../../types/search";

const initialState: SearchState = {
  innOfTheCompany: {
    inn: null,
    errorInn: false,
  },
  tonality: "any",
  numberOfDocuments: {
    quantity: null,
    errorQuantity: false,
  },
  searchRange: {
    startDate: null,
    endDate: null,
    errorDate: false,
  },
  maximumCompleteness: false,
  businessContext: false,
  mainPublication: false,
  riskFactorPublications: false,
  technicalNewsMarkets: false,
  announcementsAndCalendars: false,
  newsSummaries: false,
  btnSearchActive: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    upSearchRange: (state, action) => {
      const { data, field } = action.payload;

      if (field === "StartDate") {
        state.searchRange.startDate = data;
      }

      if (field === "endDate") {
        state.searchRange.endDate = data;
      }

      if (field === "errorDate") {
        state.searchRange.errorDate = data;
      }
    },
    upNumberOfDocuments: (state, action) => {
      const { error, field } = action.payload;
      if (field === "error") {
        state.numberOfDocuments.errorQuantity = error;
      }
      if (field === "value") {
        state.numberOfDocuments.quantity = action.payload.data;
      }
    },
    upInnOfTheCompany: (state, action) => {
      const { inn, isValid } = action.payload;

      if (inn) {
        state.innOfTheCompany.inn = action.payload.inn;
        state.innOfTheCompany.errorInn = action.payload.isValid;
      }
      if (isValid) {
        state.innOfTheCompany.errorInn = action.payload.isValid;
      }
    },
    upTonality: (state, action) => {
      state.tonality = action.payload.data;
    },
    upChecked: (state, action) => {
      switch (action.payload) {
        case "maximumCompleteness":
          state.maximumCompleteness = !state.maximumCompleteness;
          break;
        case "businessContext":
          state.businessContext = !state.businessContext;
          break;
        case "mainPublication":
          state.mainPublication = !state.mainPublication;
          break;
        case "riskFactorPublications":
          state.riskFactorPublications = !state.riskFactorPublications;
          break;
        case "technicalNewsMarkets":
          state.technicalNewsMarkets = !state.technicalNewsMarkets;
          break;
        case "announcementsAndCalendars":
          state.announcementsAndCalendars = !state.announcementsAndCalendars;
          break;
        case "newsSummaries":
          state.newsSummaries = !state.newsSummaries;
          break;
        default:
          break;
      }
    },
    upBtnSearchActive: (state, action) => {
      state.btnSearchActive = action.payload;
    },
    clearing: () => initialState,
  },
});

export const {
  upSearchRange,
  upNumberOfDocuments,
  upInnOfTheCompany,
  upTonality,
  upChecked,
  upBtnSearchActive,
  clearing
} = searchSlice.actions;

export default searchSlice.reducer;
