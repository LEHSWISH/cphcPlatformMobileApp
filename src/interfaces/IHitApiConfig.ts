import {AxiosHeaders, RawAxiosRequestHeaders, ResponseType} from 'axios';
import {AuthorizationType} from '../enums/authorization/AuthorizationType';

export interface IHitApiConfig {
  authorization: AuthorizationType;
  customHeaders?: RawAxiosRequestHeaders | AxiosHeaders;
  responseType?: ResponseType;
}
