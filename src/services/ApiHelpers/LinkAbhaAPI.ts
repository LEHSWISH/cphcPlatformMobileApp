import {AxiosPromise} from 'axios';
import HitApi from '../../classes/http/HitApi';
import {ApiEndpoints} from '../../enums/api/apiEndpointsEnum';
import {AuthorizationType} from '../../enums/authorization/AuthorizationType';
import {RequestMethod} from '../../enums/requestMethod/RequestMethod';
import {AbhaGenericResponseType} from '../../interfaces/apiResponseTypes/AbhaGenericResponseType';

const LinkAbhaAPI = {
  linkViaPhoneNumberSendOtp: (payload: {mobile: string}) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_PHONE_NUMBER_REQUEST_OTP}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
  linkViaPhoneNumberVerifyOtp: (payload: {
    otp: number | string;
    txnId: number | string;
  }) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_PHONE_NUMBER_VERIFY_OTP}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<LinkViaPhoneNumberVerifyOtpResponseType>;
  },
  linkViaPhoneNumberUserVerify: (payload: {
    txnId: number | string;
    abhaToken: number | string;
    ABHANumber: number | string;
  }) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_PHONE_NUMBER_USER_VERIFY}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
  linkViaAadhaarNumberRequestOtp: (payload: {aadhaar: string}) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_AADHAAR_NUMBER_REQUEST_OTP}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
  linkViaAadhaarNumberVerifyOtp: (payload: {
    otp: number | string;
    txnId: number | string;
  }) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_AADHAAR_NUMBER_VERIFY_OTP}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
  linkViaAbhaNumberRequestOtpViaAadhaar: (payload: {ABHANumber: string}) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_ABHA_NUMBER_REQUEST_OTP_VIA_AADHAR}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
  linkViaAbhaNumberRequestOtpViaAbha: (payload: {ABHANumber: string}) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_ABHA_NUMBER_REQUEST_OTP_VIA_ABHA}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
  linkViaAbhaAddressRequestOtpViaAadhar: (payload: {healthid: string}) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_ABHA_ADDRESS_REQUEST_OTP_VIA_AADHAR}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
  linkViaAbhaAddressRequestOtpViaAbha: (payload: {healthid: string}) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_ABHA_ADDRESS_REQUEST_OTP_VIA_ABHA}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
  linkViaAbhaNumberVerifyOtpViaAbha: (payload: {
    otp: number | string;
    txnId: number | string;
  }) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_ABHA_NUMBER_VERIFY_OTP_VIA_ABHA}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
  linkViaAbhaNumberVerifyOtpViaAadhar: (payload: {
    otp: number | string;
    txnId: number | string;
  }) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_ABHA_NUMBER_VERIFY_OTP_VIA_AADHAR}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
  linkViaAbhaAddressVerifyOtpViaAbha: (payload: {
    otp: number | string;
    txnId: number | string;
  }) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_ABHA_ADDRESS_VERIFY_OTP_VIA_ABHA}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
  linkViaAbhaAdressVerifyOtpViaAadhar: (payload: {
    otp: number | string;
    txnId: number | string;
  }) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.LINK_VIA_ABHA_ADDRESS_VERIFY_OTP_VIA_AADHAR}`,
      ignoreBaseUrl: false,
      payload: payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaGenericResponseType>;
  },
};

export default LinkAbhaAPI;

export interface LinkViaPhoneNumberVerifyOtpResponseType {
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
