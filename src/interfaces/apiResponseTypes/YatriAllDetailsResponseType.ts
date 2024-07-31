import {AbhaUserDetailsType} from './AbhaUserDetailsType';
import MedicalsReportsResponseType from './MedicalsReportsResponseType';
import {TourismUserInfoType} from './TourismUserInfoType';

export interface YatriDetailsType {
  firstName: string;
  lastName: string;
  emailId: string;
  gender: string;
  dateOfBirth: string;
  tourStartDate: string;
  tourEndDate: string;
  tourDuration: number;
  fullName?: string;
  pinCode?: string;
  state?: string;
  district?: string;
  address?: string | null;
}

export interface YatriAllDetailsResponseType {
  userName: string;
  phoneNumber: string;
  licenseAgreement: boolean;
  licenseAgreementTime: null;
  abhaNumber: string | null;
  abhaUserId: string | null;
  documentsPath?: Array<{
    fileName: string;
    filePath: string;
    createdOn?: string;
    lastUpdatedOn?: string;
  }>;
  governmentIdType: string | null;
  governmentId: string | null;
  // idtpId: null
  // idypId: null
  yatriDetails?: YatriDetailsType | null;
  medicalsReports?: MedicalsReportsResponseType | null;
  abhaUserDetails?: AbhaUserDetailsType | null;
  tourismUserInfo?: TourismUserInfoType | null;
}
