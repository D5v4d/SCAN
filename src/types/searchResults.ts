import type { SearchState } from "./search";

export type HistogramItem = {
  summary: {
    data:
      | [
          {
            date: string;
            total: number;
            risks: number;
          }
        ]
      | [];
    isData: boolean;
    totalOptions: number;
    isLoadingSummary: boolean;
    isErrorSummary: boolean;
  };
  publicationsId: {
    data:
      | [
          {
            encodedId: string;
            influence: number;
            similarCount: number;
          }
        ]
      | [];
    startData: number;
    endData: number;
    isLoadingPublicationsItems: boolean;
    isErrorPublicationsItems: boolean;
  };

  listDocuments: {
    data: Array<ListDocuments>;
    isLoadinglistDocuments: boolean;
    isErrorlistDocuments: boolean;
  } 
};

export type ListDocuments = {
  schemaVersion: string;
  id: string;
  version: 1;
  issueDate: string;
  url: string;
  source: {
    id: number;
    groupId: number;
    name: string;
    categoryId: number;
    levelId: number;
  };
  dedupClusterId: string;
  title: {
    text: string;
    markup: string;
  };
  content: {
    markup: string;
  };
  entities: {
    companies: [
      {
        suggestedCompanies: [
          {
            sparkId: number;
            inn: string;
            ogrn: string;
            searchPrecision: string;
          }
        ];
        resolveInfo: {
          resolveApproaches: [string];
        };
        tags: [string];
        isSpeechAuthor: false;
        localId: number;
        name: string;
        entityId: number;
        isMainRole: true;
      }
    ];
    people: [];
    themes: [
      {
        localId: number;
        name: string;
        entityId: number;
        tonality: string;
      }
    ];
    locations: [
      {
        code: {
          countryCode: string;
          regionCode: string;
        };
        localId: number;
        name: string;
        isMainRole: true;
      }
    ];
  };
  attributes: {
    isTechNews: false;
    isAnnouncement: false;
    isDigest: false;
    influence: number;
    wordCount: number;
    coverage: {
      value: number;
      state: string;
    };
  };
  language: string;
};

export type SearchResults = {
  date: string;
  value: number;
};

export type FetchOptions = {
  token: string;
  search: SearchState;
};

export type FetchPublications = {
  token: string;
  items: [{ encodedId: string; influence: number; similarCount: number }];
  startData: number;
  endData: number;
};
