import {AxiosPromise} from 'axios';
import HitApi from '../../classes/http/HitApi';
import {ApiEndpoints} from '../../enums/api/apiEndpointsEnum';
import {AuthorizationType} from '../../enums/authorization/AuthorizationType';
import {RequestMethod} from '../../enums/requestMethod/RequestMethod';

const AbhaCreationAPI = {
  AbhaCreationGenerateAaadhaarOtpApi: (
    payload: AbhaCreationGenerateAaadhaarOtpApiPayloadType | string,
  ) => {
    return HitApi.hitapi({
      url: ApiEndpoints.ABHA_CREATION_GENERATE_AADHAAR_OTP_POST,
      payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaCreationGenerateAadharOtpResponse>;
  },
  AbhaCreationVerifyAaadhaarOtpApi: (
    payload: AbhaCreationVerifyAadharOtpPayloadType,
  ) => {
    return HitApi.hitapi({
      url: ApiEndpoints.ABHA_CREATION_VERIFY_AADHAAR_OTP_POST,
      payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaCreationVerifyAadharOtpResponseType>;
  },
  AbhaCreationGenerateMobileOtpApi: (
    payload: AbhaCreationGenerateMobileOtpPayloadType,
  ) => {
    return HitApi.hitapi({
      url: ApiEndpoints.ABHA_CREATION_GENERATE_MOBLIE_OTP_POST,
      payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaCreationGenerateMobileOtpResponseType>;
  },
  AbhaCreationVerifyMobileOtpApi: (
    payload: AbhaCreationVerifyMobileOtpPayloadType,
  ) => {
    return HitApi.hitapi({
      url: ApiEndpoints.ABHA_CREATION_VERIFY_MOBILE_OTP_POST,
      payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaCreationVerifyMobileOtpResponseType>;
  },
  suggestionsApi: (payload: {txnId: number | string}) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.CREATE_ABHA_SUGGESTIONS}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaAddressSuggestionResponseType>;
  },
  fetchAbhaCard: (payload: {
    abhaToken?: string | null;
    authType?: string | null;
    aadharNumber?: string | null;
  }) => {
    return HitApi.hitapi({
      url: ApiEndpoints.FETCH_ABHA_CARD,
      requestMethod: RequestMethod.POST,
      ignoreBaseUrl: false,
      payload,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise;
  },
  fetchAbhaCardPdf: (payload: {
    abhaToken?: string | null;
    authType?: string | null;
    aadharNumber?: string | null;
  }) => {
    return HitApi.hitapi({
      url: ApiEndpoints.FETCH_ABHA_CARD_PDF,
      requestMethod: RequestMethod.POST,
      ignoreBaseUrl: false,
      payload,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise;
  },
  createAbhaAddress: (payload: {
    txnId: number | string;
    abhaAddress: string | null;
    preferred: number;
  }) => {
    return HitApi.hitapi({
      url: ApiEndpoints.CREATE_ABHA_ADDRESS,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise;
  },
};

export interface AbhaCreationGenerateAaadhaarOtpApiPayloadType {
  aadhaar: string;
  consent: boolean;
}

export interface AbhaCreationGenerateAadharOtpResponse {
  txnId: string;
  message: string;
  mobile: string;
  mobileNumberMatched: boolean;
  ABHANumber: string | null;
  tokens: {
    token?: string;
    expiresIn?: number;
    refreshToken?: string;
    refreshExpiresIn?: string;
  } | null;
  firstName: string;
  authType: string | null;
  abhaAddressList: string | null;
  preferredAbhaAddress: string | null;
  healthIdNumber: string | null;
  preSignedUrl: string | null;
  new: boolean;
}

export interface AbhaCreationVerifyAadharOtpPayloadType {
  otp: string;
  txnId: string;
  mobile: string;
}

export interface AbhaCreationVerifyAadharOtpResponseType
  extends AbhaCreationGenerateAadharOtpResponse {}

export interface AbhaCreationGenerateMobileOtpPayloadType {
  txnId: string;
  mobile: string;
}

export interface AbhaCreationGenerateMobileOtpResponseType
  extends AbhaCreationGenerateAadharOtpResponse {}

export interface AbhaCreationVerifyMobileOtpPayloadType {
  mobile: number | string;
  txnId: string;
  otp: string;
}

export interface AbhaCreationVerifyMobileOtpResponseType
  extends AbhaCreationGenerateAadharOtpResponse {}

export interface AbhaAddressSuggestionResponseType {
  txnId: string;
  message: null;
  mobile: null;
  tokens: null;
  firstName: null;
  authType: null;
  mobileNumberMatched: false;
  abhaAddressList: string[];
  preferredAbhaAddress: null;
  healthIdNumber: null;
  preSignedUrl: null;
  new: false;
  ABHANumber: null;
}
export default AbhaCreationAPI;
