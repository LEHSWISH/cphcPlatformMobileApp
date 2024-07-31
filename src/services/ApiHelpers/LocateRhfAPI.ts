import {AxiosPromise} from 'axios';
import HitApi from '../../classes/http/HitApi';
import {ApiEndpoints} from '../../enums/api/apiEndpointsEnum';
import {AuthorizationType} from '../../enums/authorization/AuthorizationType';
import {RequestMethod} from '../../enums/requestMethod/RequestMethod';
import {
  DistrictAllResponseType,
  RhfFacilityListType,
  StateAllResponseType,
} from '../../interfaces/apiResponseTypes/RegionalHealthFacilityResponseTypes';

const LocateRhfAPI = {
  /**
   * Get All states in response
   */
  getAllState: () => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.RHF_GET_ALL_STATES}`,
      requestMethod: RequestMethod.GET,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<StateAllResponseType>;
  },
  /*
   * Get All districts list for a given state
   */
  getDistrictList: (stateCode: string) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.RHF_GET_DISTRICT_LIST}`.replace(
        '{stateCode}',
        stateCode,
      ),
      requestMethod: RequestMethod.GET,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<DistrictAllResponseType>;
  },

  /**
   * Get list of facilities for a given state and district combination
   */
  getRhfFacilityList: (payload: {stateCode: string; districtCode: string}) => {
    return HitApi.hitapi({
      url: `${ApiEndpoints.RHF_GET_FACILITY_LIST}`
        .replace('{stateCode}', payload.stateCode)
        .replace('{districtCode}', payload.districtCode),
      requestMethod: RequestMethod.GET,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<RhfFacilityListType>;
  },
};

export default LocateRhfAPI;
