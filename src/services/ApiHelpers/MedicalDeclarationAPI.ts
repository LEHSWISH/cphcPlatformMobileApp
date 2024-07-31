import {AxiosPromise} from 'axios';
import HitApi from '../../classes/http/HitApi';
import {ApiEndpoints} from '../../enums/api/apiEndpointsEnum';
import {AuthorizationType} from '../../enums/authorization/AuthorizationType';
import {RequestMethod} from '../../enums/requestMethod/RequestMethod';
import MedicalsReportsResponseType from '../../interfaces/apiResponseTypes/MedicalsReportsResponseType';

const MedicalDeclarationAPI = {
  get: () =>
    HitApi.hitapi({
      url: ApiEndpoints.FETCH_MEDICAL_REPORT_GET,
      requestMethod: RequestMethod.GET,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise<MedicalsReportsResponseType>,
  update: (payload: MedicalsReportsResponseType) =>
    HitApi.hitapi({
      url: ApiEndpoints.UPDATE_MEDICAL_REPORT_POST,
      payload,
      requestMethod: RequestMethod.POST,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
    }) as AxiosPromise,
};

export default MedicalDeclarationAPI;
