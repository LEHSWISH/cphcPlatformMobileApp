export interface AbhaGenericResponseType {
  txnId: string;
  message: string;
  mobile: string;
  mobileNumberMatched: boolean;
  ABHANumber: string | null;
  tokens: {
    token?: string;
    expiresIn?: number;
    refreshToken?: string;
    refreshExpiresIn?: number;
  } | null;
  firstName: string;
  authType: string | null;
  abhaAddressList: string | null;
  preferredAbhaAddress: string | null;
  healthIdNumber: string | null;
  preSignedUrl: string | null;
  new: boolean;
}
