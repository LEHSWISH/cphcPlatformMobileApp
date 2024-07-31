import {TemplateKeyEnum} from '../../enums/api/authTemplateKeyEnum';

export interface UpdateYartriDetailsPayloadType {
  phoneNumber: string;
  otp?: string;
  templateKey?: TemplateKeyEnum;
  licenseAggreement?: boolean;
  documentsPath?: Array<{
    fileName: string;
    filePath: string;
    createdOn?: string;
    lastUpdatedOn?: string;
  }>;
  governmentIdType?: string;
  governmentId?: string;
  idtpId?: string;
  yatriDetails?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    emailId?: string;
    gender?: string;
    dateOfBirth?: string;
    tourStartDate?: string;
    tourEndDate?: string;
    tourDuration?: number;
    address?: string;
    pinCode?: string;
    state?: string;
    district?: string;
    phoneNumber?: string;
  };
  medicalsReports?: {
    heartDisease?: boolean;
    hypertension?: boolean;
    respiratoryDiseaseOrAsthma?: boolean;
    diabetesMellitus?: boolean;
    epilepsyOrAnyNeurologicalDisorder?: boolean;
    kidneyOrUrinaryDisorder?: boolean;
    cancer?: boolean;
    migraineOrPersistentHeadache?: boolean;
    anyAllergies?: boolean;
    disorderOfTheJointsOrMusclesArthritisGout?: boolean;
    anyMajorSurgery?: boolean;
  };
}
