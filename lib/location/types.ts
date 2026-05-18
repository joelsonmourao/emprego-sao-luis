export type TrustedLocationEnrichment = {
  streetAddress: string;
  postalCode: string;
  latitude: number;
  longitude: number;
};

export type LocationEnrichmentLookupInput = {
  companyName: string;
  city: string;
  state: string;
};
