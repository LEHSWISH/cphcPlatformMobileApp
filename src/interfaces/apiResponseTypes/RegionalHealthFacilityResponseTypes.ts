interface StateElementType {
  stateCode: string;
  stateName: string;
}
export interface StateAllResponseType extends Array<StateElementType> {}

interface DistrictElementType {
  districtCode: string;
  districtName: string;
}
export interface DistrictAllResponseType extends Array<DistrictElementType> {}

export interface RhfFacilityType {
  facilityId: string;
  facilityName: string;
  facilityStatus: string;
  facilityType: string;
  ownership: string;
  address: string;
  abdmEnabled: boolean;
}
export interface RhfFacilityListType extends Array<RhfFacilityType> {}
