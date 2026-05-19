export type LocationProviderPlace = {
  providerPlaceId: string;
  displayName: string;
  formattedAddress: string;
  streetAddress: string | null;
  postalCode: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  types: string[];
  rankConfidence?: number | null;
  rankConfidenceCityLevel?: number | null;
  rankConfidenceStreetLevel?: number | null;
  rankMatchType?: string | null;
};

export interface LocationEnrichmentProvider {
  readonly id: string;
  searchBranch(query: string, context: { city: string; state: string; companyName?: string }): Promise<LocationProviderPlace | null>;
}
