export enum AuthorizationType {
  BEARER_TOKEN = 'BEARER_TOKEN',
  BASIC_AUTH_TOKEN = 'BASIC_AUTH_TOKEN',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
}

export enum AsyncStorageKeysEnum {
  YATRI_AUTH_CONFIG = 'yatri/auth/config',
  YATRI_SESSION_ID = 'yatri/sessionID',
  YATRI_AUTH_TOKEN = 'yatri/authToken',
  YATRI_USER_NAME = 'yatri/user-name',
}
