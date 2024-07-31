import axios, {AxiosHeaders, RawAxiosRequestHeaders, isAxiosError} from 'axios';
import {environment} from '../../environment/environment';
import {IHitApi} from '../../interfaces/IHitApi';
import {AuthorizationType} from '../../enums/authorization/AuthorizationType';
import {RequestMethod} from '../../enums/requestMethod/RequestMethod';
import {store} from '../../services/store/store';
import {STATIC_BASIC_AUTH_TOKEN} from '../../utils/constants/Constant';
import {logoutYatri} from '../../services/store/slices/authSlice';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {t} from 'i18next';

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (
      isAxiosError(error) &&
      `${error.response?.data?.message}`?.toLowerCase() ===
        'JWT was expired or incorrect'?.toLowerCase()
    ) {
      store.dispatch(logoutYatri());
      setTimeout(() => {
        store.dispatch(
          setSnackBar({
            message: t('common_error_messages.token-expired'),
            visible: true,
          }),
        );
      }, 0);
    }
    return Promise.reject(error);
  },
);

export default class HitApi {
  static async hitapi(apiParams: IHitApi) {
    let url: string = apiParams.url;
    if (!apiParams.ignoreBaseUrl) {
      if (url.includes('user-service')) {
        url =
          environment.UserService +
          url.replace('user-service', '').replace('/api', 'api');
      } else if (url.includes('abha-service')) {
        url =
          environment.AbhaService +
          url.replace('abha-service', '').replace('/api', 'api');
      } else if (url.includes('health-service')) {
        url =
          environment.HealthService +
          url.replace('health-service', '').replace('/api', 'api');
      } else if (url.includes('notification-service')) {
        url =
          environment.NotificationService +
          url.replace('notification-service', '').replace('/api', 'api');
      }
    }
    const axiosConfig: object = generateConfig(apiParams);
    try {
      const response = axios({
        url: url,
        method: apiParams.requestMethod,
        data: apiParams.payload ? apiParams.payload : null,
        ...axiosConfig,
      })
        .then(apiResponse => {
          if (apiParams?.sucessFunction) {
            apiParams?.sucessFunction(apiResponse);
          }
          return apiResponse;
        })
        .catch(error => {
          if (apiParams?.errorFunction) {
            apiParams.errorFunction(error.response);
          } else {
            return Promise.reject(error);
          }
        })
        .finally(() => {
          if (apiParams.endFunction) {
            apiParams.endFunction();
          }
        });
      return response;
    } catch (error: unknown) {
      console.error(error);
      return error;
    }
    function generateConfig(apiArgs: IHitApi) {
      const headers: AxiosHeaders | RawAxiosRequestHeaders = {};

      if (apiArgs?.config?.authorization === AuthorizationType.BEARER_TOKEN) {
        const token = store.getState().auth?.yatri?.token;
        const sessionId = store.getState().auth.yatri.sessionId;
        headers.Authorization = `Bearer ${token}`;
        headers['x-session-id'] = `${sessionId}`;
      } else if (
        apiArgs?.config?.authorization !== AuthorizationType.NOT_AUTHORIZED &&
        (url.includes(environment.AbhaService) ||
          url.includes(environment.UserService) ||
          url.includes(environment.HealthService) ||
          url.includes(environment.NotificationService))
      ) {
        headers.Authorization = `Basic ${STATIC_BASIC_AUTH_TOKEN}`;
      }
      if (
        url.includes(environment.AbhaService) ||
        url.includes(environment.UserService) ||
        url.includes(environment.HealthService) ||
        url.includes(environment.NotificationService)
      ) {
        headers['X-Organization-Id'] = 'wish';
      }
      if (
        (apiArgs?.requestMethod === RequestMethod.GET ||
          apiArgs?.requestMethod === RequestMethod.DELETE) &&
        apiArgs?.payload
      ) {
        headers['Content-Type'] = 'application/json';
      }
      const config = {
        headers: {
          ...headers,
          ...(apiArgs?.config?.customHeaders
            ? apiArgs?.config?.customHeaders
            : {}),
        },
        body: apiArgs.payload,
      };
      return config;
    }
  }
}
