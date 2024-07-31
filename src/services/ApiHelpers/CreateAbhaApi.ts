import {AxiosPromise} from 'axios';
import HitApi from '../../classes/http/HitApi';
import {ApiEndpoints} from '../../enums/api/apiEndpointsEnum';
import {AuthorizationType} from '../../enums/authorization/AuthorizationType';
import {RequestMethod} from '../../enums/requestMethod/RequestMethod';

const CreateAbhaApi = {
  IdtpGetUserInfoApi: ({tourismPortalId}: {tourismPortalId: string}) => {
    // >>> consent to be removed from here once backend changes are done and deployed
    return HitApi.hitapi({
      url: `${ApiEndpoints.USER_INFO_BY_IDTP_GET}`
        .replace('{{id}}', tourismPortalId)
        .replace('{{consent}}', `${true}`),
      requestMethod: RequestMethod.GET,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<GetUserInfoByIDTP_ApiResponseType>;
  },

  getPostalPinCodeInfo: (pincode: string) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.GET_STATE_BY_PINCODE}`.replace(
        '{{pincode}}',
        pincode,
      ),
      requestMethod: RequestMethod.GET,
      ignoreBaseUrl: false,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<{
      district: null | string;
      state: null | string;
      city: null | string;
    }>;
  },

  generateAbhaByDemograpicAPI: (
    payload: GenerateAbhaByDemograpicAPIRequestType,
  ) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.CREATE_ABHA_AUTH_DEMOGRAPHIC_POST}`,
      requestMethod: RequestMethod.POST,
      ignoreBaseUrl: false,
      payload,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<AbhaCreationGenerateAadharOtpResponseTypeV2>;
  },
};

export default CreateAbhaApi;

export interface GetUserInfoByIDTP_ApiResponseType {
  fullName: string;
  emailId: string | null;
  aadhaarNo: string | null;
  phoneNumber: string;
  gender: string;
  dateOfBirth: null | string;
  address?: string;
}

export interface AbhaCreationGenerateAadharOtpResponseTypeV2 {
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

export interface GenerateAbhaByDemograpicAPIRequestType {
  aadharNumber: string;
  dateOfBirth: string;
  gender: string;
  stateCode: string;
  districtCode: string;
  name: string;
  mobileNumber: string;
  consent: boolean;
}
