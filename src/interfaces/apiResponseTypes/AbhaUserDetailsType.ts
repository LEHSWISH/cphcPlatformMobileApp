export interface AbhaUserDetailsType {
  createdOn: string;
  updatedOn: string;
  id: string;
  ABHANumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  imagePath: string | null;
  phoneNumber: string;
  emailId: string;
  phrAddress: string[];
  address: string;
  districtCode: string;
  stateCode: string;
  districtName: string;
  stateName: string;
  pinCode: string;
  abhaType: null | string;
  abhaStatus: string;
  yatriPulseUserId: string;
}
