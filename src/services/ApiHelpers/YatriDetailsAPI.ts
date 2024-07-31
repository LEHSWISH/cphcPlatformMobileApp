import {AxiosPromise} from 'axios';
import HitApi from '../../classes/http/HitApi';
import {ApiEndpoints} from '../../enums/api/apiEndpointsEnum';
import {AuthorizationType} from '../../enums/authorization/AuthorizationType';
import {RequestMethod} from '../../enums/requestMethod/RequestMethod';
import {YatriAllDetailsResponseType} from '../../interfaces/apiResponseTypes/YatriAllDetailsResponseType';
import {UpdateYartriDetailsPayloadType} from '../../interfaces/apiResponseTypes/ApiRequestPayoadTypes';

const YatriDetailsAPI = {
  getAllDetails: () => {
    return HitApi.hitapi({
      url: ApiEndpoints.YATRI_GET_ALL_DETAILS_GET,
      requestMethod: RequestMethod.GET,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<YatriAllDetailsResponseType>;
  },
  updateYatriDetailsApi: (payload: UpdateYartriDetailsPayloadType) => {
    return HitApi.hitapi({
      url: ApiEndpoints.YATRI_UPDATE_DETAILS_POST,
      requestMethod: RequestMethod.POST,
      payload,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<YatriAllDetailsResponseType>;
  },
};

export default YatriDetailsAPI;
