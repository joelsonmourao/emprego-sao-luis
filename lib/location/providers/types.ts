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
};

export interface LocationEnrichmentProvider {
  readonly id: string;
  searchBranch(query: string, context: { city: string; state: string }): Promise<LocationProviderPlace | null>;
}
