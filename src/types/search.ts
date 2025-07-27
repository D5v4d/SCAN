export type SearchState = {
  innOfTheCompany: {
    inn: string | null;
    errorInn: boolean;
  };
  tonality: string;
  numberOfDocuments: {
    quantity: string | null;
    errorQuantity: boolean;
  };
  searchRange: {
    startDate: string | null;
    endDate: string | null;
    errorDate: boolean;
  };
  maximumCompleteness: boolean;
  businessContext: boolean;
  mainPublication: boolean;
  riskFactorPublications: boolean;
  technicalNewsMarkets: boolean;
  announcementsAndCalendars: boolean;
  newsSummaries: boolean;
  btnSearchActive: boolean;
};