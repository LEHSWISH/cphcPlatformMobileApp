import {AxiosPromise} from 'axios';
import HitApi from '../../classes/http/HitApi';
import {ApiEndpoints} from '../../enums/api/apiEndpointsEnum';
import {AuthorizationType} from '../../enums/authorization/AuthorizationType';
import {RequestMethod} from '../../enums/requestMethod/RequestMethod';
import {AbhaGenericResponseType} from '../../interfaces/apiResponseTypes/AbhaGenericResponseType';

const RecoverAbhaAPI = {
  generateMobileOtpApi: (payload: {mobile: string; consent: boolean}) => {
    return HitApi.hitapi({
      url: ApiEndpoints.RECOVER_ABHA_GENERATE_OTP_BY_PHONE_NUMBER,
      payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
  verifyMobileOtp: (payload: {txnId: string; otp: string}) => {
    return HitApi.hitapi({
      url: ApiEndpoints.RECOVER_ABHA_VERIFY_OTP_BY_PHONE_NUMBER,
      payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<RecoverAbhaGenerateMobileOtpApiResponseType>;
  },
  verifyUser: (payload: {
    txnId: string;
    abhaToken: string;
    ABHANumber: string;
  }) => {
    return HitApi.hitapi({
      url: ApiEndpoints.RECOVER_ABHA_VERIFY_USER,
      payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
};

export default RecoverAbhaAPI;

export interface RecoverAbhaGenerateMobileOtpApiResponseType {
  ABHAProfile: null | string;
  accounts: Array<{
    ABHANumber: string;
    abhaStatus: null | string;
    abhaType: null | string;
    address: null | string;
    districtCode: null | string;
    districtName: null | string;
    dob: string; // dd-mm-yyyy
    email: null | string;
    firstName: null | string;
    gender: string; // eg => "M"
    kycVerified: string;
    lastName: null | string;
    middleName: null | string;
    mobile: null | string;
    name: string;
    photo: null | unknown;
    phrAddress: null | unknown;
    pinCode: null | string;
    preferredAbhaAddress: string;
    profilePhoto: string;
    stateCode: null | string;
    stateName: null | string;
    status: string;
    verificationType: string;
    verifiedStatus: string;
  }>;
  authResult: string;
  expiresIn: number;
  isNew: null | boolean;
  message: string;
  refreshExpiresIn: 0;
  refreshToken: null;
  requestMobile: null;
  token: string;
  tokens: null;
  txnId: string;
}
