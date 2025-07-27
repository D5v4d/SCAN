import { createAsyncThunk, createSlice } from "@reduxjs/toolkit/react";
import type {
  FetchOptions,
  FetchPublications,
  HistogramItem,
  ListDocuments,
  SearchResults,
} from "../../types/searchResults";

const fetchData = async (endpoint: string, { token, search }: FetchOptions) => {
  const requestBody = {
    issueDateInterval: {
      startDate: search.searchRange.startDate,
      endDate: search.searchRange.endDate,
    },
    searchContext: {
      targetSearchEntitiesContext: {
        targetSearchEntities: [
          {
            type: "company",
            inn: search.innOfTheCompany.inn,
            maxFullness: search.maximumCompleteness,
            inBusinessNews: search.businessContext,
          },
        ],
        onlyMainRole: search.mainPublication,
        tonality: search.tonality,
        onlyWithRiskFactors: search.riskFactorPublications,
      },
    },
    attributeFilters: {
      excludeTechNews: search.technicalNewsMarkets,
      excludeAnnouncements: search.announcementsAndCalendars,
      excludeDigests: search.newsSummaries,
    },
    similarMode: "duplicates",
    limit: search.numberOfDocuments.quantity,
    sortType: "issueDate",
    sortDirectionType: "asc",
    intervalType: "month",
    histogramTypes: ["totalDocuments", "riskFactors"],
  };

  const url = `https://gateway.scan-interfax.ru/api/v1/${endpoint}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const fetchHistograms = createAsyncThunk(
  "data/fetchHistograms",
  async (options: FetchOptions) => fetchData("objectsearch/histograms", options)
);

export const fetchPublicationsItems = createAsyncThunk(
  "data/fetchPublications",
  async (options: FetchOptions) => fetchData("objectsearch", options)
);

export const fetchPublications = createAsyncThunk(
  "documents",
  async ({ token, items, startData, endData }: FetchPublications) => {
    const firstTenItems = items.slice(startData, endData);
    const url = `https://gateway.scan-interfax.ru/api/v1/documents`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ids: firstTenItems,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
);

const initialState: HistogramItem = {
  summary: {
    data: [],
    isData: true,
    totalOptions: 0,
    isLoadingSummary: false,
    isErrorSummary: false,
  },
  publicationsId: {
    data: [],
    startData: 0,
    endData: 10,
    isLoadingPublicationsItems: false,
    isErrorPublicationsItems: false,
  },
  listDocuments: {
    data: [],
    isLoadinglistDocuments: false,
    isErrorlistDocuments: false,
  },
};
const searchResultsSlice = createSlice({
  name: "searchResultsSlice",
  initialState,
  reducers: {
    upListDocuments: (state) => {
      state.publicationsId.endData = state.publicationsId.endData + 10;
      state.publicationsId.startData = state.publicationsId.startData + 10;
    },
    clearing: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistograms.pending, (state) => {
        state.summary.isLoadingSummary = true;
      })
      .addCase(fetchHistograms.fulfilled, (state, action) => {
        state.summary.isLoadingSummary = false;
        if (action.payload.data.length) {
          state.summary.isData = true;
          action.payload.data[0].data.forEach(
            (e: SearchResults) =>
              (state.summary.totalOptions =
                state.summary.totalOptions + e.value)
          );

          const data = action.payload.data;
          // Разделим данные
          const totalDocuments = data[0].data;
          const riskFactors = data[1].data;

          totalDocuments.sort(
            (a: SearchResults, b: SearchResults) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          riskFactors.sort(
            (a: SearchResults, b: SearchResults) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          // Формируем итоговый массив
          const summary = totalDocuments.map(
            (item: SearchResults, index: number) => ({
              date: item.date,
              total: item.value,
              risks: riskFactors[index].value,
            })
          );
          state.summary.data = summary;
        } else {
          state.summary.isData = false;
        }
      })
      .addCase(fetchHistograms.rejected, (state) => {
        state.summary.isLoadingSummary = false;
        state.summary.isErrorSummary = true;
      })

      .addCase(fetchPublicationsItems.pending, (state) => {
        state.publicationsId.isLoadingPublicationsItems = true;
      })
      .addCase(fetchPublicationsItems.fulfilled, (state, action) => {
        state.publicationsId.isLoadingPublicationsItems = false;
        if (state.summary.isData) {
          const items = action.payload.items;
          const newItems = items.map((e: { encodedId: string }) => e.encodedId);

          state.publicationsId.data = newItems;
        }
      })
      .addCase(fetchPublicationsItems.rejected, (state) => {
        state.publicationsId.isLoadingPublicationsItems = false;
        state.publicationsId.isErrorPublicationsItems = true;
      })

      .addCase(fetchPublications.pending, (state) => {
        state.listDocuments.isLoadinglistDocuments = true;
      })
      .addCase(fetchPublications.fulfilled, (state, action) => {
        state.listDocuments.isLoadinglistDocuments = false;
        const newItems = action.payload.map((e: { ok: ListDocuments }) => e.ok);
        state.listDocuments.data = [...state.listDocuments.data, ...newItems];
      })
      .addCase(fetchPublications.rejected, (state) => {
        state.listDocuments.isLoadinglistDocuments = false;
        state.listDocuments.isErrorlistDocuments = true;
      });
  },
});

export const { upListDocuments, clearing } = searchResultsSlice.actions;

export default searchResultsSlice.reducer;
