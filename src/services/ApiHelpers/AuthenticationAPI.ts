import {AxiosPromise} from 'axios';
import HitApi from '../../classes/http/HitApi';
import {ApiEndpoints} from '../../enums/api/apiEndpointsEnum';
import {RequestMethod} from '../../enums/requestMethod/RequestMethod';
import {TemplateKeyEnum} from '../../enums/api/authTemplateKeyEnum';

const AuthenticationAPI = {
  login: (args: LoginApiPayloadType) => {
    return HitApi.hitapi({
      url: ApiEndpoints.LOGIN,
      payload: args,
      requestMethod: RequestMethod.POST,
    }) as AxiosPromise<LoginApiResponseType>;
  },
  verifyUserNameOnSignup: (userName: string) =>
    HitApi.hitapi({
      url: `${ApiEndpoints.VERIFY_USER_NAME}${userName}`,
      requestMethod: RequestMethod.GET,
      ignoreBaseUrl: false,
    }) as AxiosPromise,
  sendOtpForSignup: (payload: SendOtpForSignupApiPayloadType) =>
    HitApi.hitapi({
      url: `${ApiEndpoints.SEND_OTP}`,
      requestMethod: RequestMethod.POST,
      payload,
      ignoreBaseUrl: false,
    }) as AxiosPromise,
  resendOtpForAuth: (payload: ResendOtpForAuthApiPayloadType) =>
    HitApi.hitapi({
      url: ApiEndpoints.RESEND_OTP,
      payload,
      ignoreBaseUrl: false,
      requestMethod: RequestMethod.POST,
    }) as AxiosPromise,
  signUp: (payload: SignupApiPayloadType) =>
    HitApi.hitapi({
      url: `${ApiEndpoints.SIGN_UP}`,
      ignoreBaseUrl: false,
      requestMethod: RequestMethod.POST,
      payload,
    }) as AxiosPromise,
  encryptPassword: (payload: {keyToEncrypt: string}) =>
    HitApi.hitapi({
      url: ApiEndpoints.PASSWORD_ENCRYPTION_POST,
      requestMethod: RequestMethod.POST,
      payload,
      ignoreBaseUrl: false,
    }) as AxiosPromise,
  getAllUserLinkedWithPhoneNumber: (phoneNumber: string) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.GET_ALL_USER_LINKED_WITH_PHONE_NUMBER}`.replace(
        '{phoneNumber}',
        phoneNumber,
      ),
      requestMethod: RequestMethod.GET,
    }) as AxiosPromise<GetAllUserLinkedWithPhoneNumberResponseType>;
  },
};

export default AuthenticationAPI;

export interface LoginApiPayloadType {
  userName: string;
  password: string;
  redirectFromRegistration?: boolean;
  sessionId?: string;
}

export interface LoginApiResponseType {
  token: string | null;
  yatri: null | unknown;
  message: string | null;
}

export interface SendOtpForSignupApiPayloadType {
  userName: string;
  phoneNumber: string;
  templateKey: TemplateKeyEnum;
}

export interface ResendOtpForAuthApiPayloadType
  extends SendOtpForSignupApiPayloadType {}

export interface SignupApiPayloadType {
  phoneNumber: string;
  userName: string;
  password: string;
  otp: string;
  licenseAgreement: boolean;
  templateKey: TemplateKeyEnum;
}

export interface GetAllUserLinkedWithPhoneNumberResponseType {
  linkedWith: number;
  users: string[];
  mobileNumber: string;
}
