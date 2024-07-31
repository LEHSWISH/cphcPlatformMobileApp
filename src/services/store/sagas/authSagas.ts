import {t} from 'i18next';
import {PayloadAction} from '@reduxjs/toolkit';
import {all, call, put, takeEvery} from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {produce} from 'immer';
import {v4 as uuidV4} from 'uuid';
import bcrypt from 'bcryptjs';
import {
  UserAuthConfigType,
  loadYatriAuthData,
  loginYatri,
  logoutYatri,
  switchToGuestUser,
  switchToMainUser,
  updateAuthSliceState,
} from '../slices/authSlice';
import AuthenticationAPI, {
  LoginApiPayloadType,
  LoginApiResponseType,
} from '../../ApiHelpers/AuthenticationAPI';
import {AsyncStorageKeysEnum} from '../../../enums/authorization/AuthorizationType';
import {store} from '../store';
import {isAxiosError} from 'axios';
import {setSnackBar} from '../slices/helperSlice';
import {encryption} from '../../../utils/Helper';
import {ENCRPTION_SALT} from '../../../utils/constants/Constant';

const insertDataIntoAsyncStorage = (dataToInsert: UserAuthConfigType) => {
  const dataToInsertString = JSON.stringify(dataToInsert);
  return AsyncStorage.setItem(
    AsyncStorageKeysEnum.YATRI_AUTH_CONFIG,
    dataToInsertString,
  );
};

function* getYatriLoginAsync(
  action: PayloadAction<LoginApiPayloadType>,
): unknown {
  const baseState = store.getState().auth;
  try {
    const sessionId = action.payload.sessionId || uuidV4();
    let salt = ENCRPTION_SALT;
    const hashedPassword = bcrypt.hashSync(action.payload.password, salt); // hash created previously created upon sign up
    const timeStamp = new Date().toISOString();
    const password = `${timeStamp}%${hashedPassword}`;
    const encryptedPassword = encryption(password)?.toString();
    const response = yield call(AuthenticationAPI.login, {
      password: encryptedPassword,
      userName: action.payload.userName,
      redirectFromRegistration: action.payload.redirectFromRegistration,
      sessionId,
    });
    const responseData = response?.data as LoginApiResponseType;
    yield call(insertDataIntoAsyncStorage, {
      isGuestUserActive: false,
      primaryUserInfo: {
        token: responseData.token,
        userName: action.payload.userName,
      },
      guestUserInfo: null,
      sessionId,
    } as UserAuthConfigType);
    const nextState = produce(baseState, draftState => {
      draftState.yatri = {
        response: responseData,
        token: responseData.token,
        userName: action.payload.userName,
        error: null,
        loading: false,
        sessionId,
      };
    });
    yield put(updateAuthSliceState(nextState));
  } catch (error) {
    const errorMessage =
      (isAxiosError(error) &&
        error.response?.data &&
        error.response?.data?.message) ||
      t('common_error_messages.something_went_wrong');

    const nextState = produce(baseState, draftState => {
      draftState.yatri = {
        response: {
          message: errorMessage,
          token: null,
          yatri: null,
        },
        token: null,
        userName: null,
        loading: false,
        error: errorMessage,
        sessionId: null,
      };
    });
    yield put(updateAuthSliceState(nextState));
    yield put(logoutYatri());
    yield put(
      setSnackBar({
        visible: true,
        message: t('common_error_messages.login_failed_invalid'),
      }),
    );
  }
}

function* loadYatriAuthDataAsync() {
  const configString: string | null = yield call(
    AsyncStorage.getItem,
    AsyncStorageKeysEnum.YATRI_AUTH_CONFIG,
  );
  const baseState = store.getState().auth;
  if (configString) {
    const config = JSON.parse(configString) as UserAuthConfigType;
    if (config && config?.primaryUserInfo?.token && config?.sessionId) {
      const nextState = produce(baseState, draftState => {
        draftState.config = config;
        draftState.yatri.sessionId = config.sessionId;
        if (config.isGuestUserActive && config.guestUserInfo?.token) {
          draftState.yatri.token = config.guestUserInfo?.token;
          draftState.yatri.userName = config.guestUserInfo.userName;
        } else {
          draftState.yatri.token = config.primaryUserInfo!?.token;
          draftState.yatri.userName = config.primaryUserInfo!.userName;
        }
        draftState.yatri.loading = false;
      });
      yield put(updateAuthSliceState(nextState));
    } else {
      yield put(logoutYatri());
      const nextState = produce(baseState, draftState => {
        draftState.yatri = {
          response: null,
          token: null,
          userName: null,
          loading: false,
          error: null,
        };
      });
      yield put(updateAuthSliceState(nextState));
    }
  } else {
    const nextState = produce(baseState, draftState => {
      draftState.yatri = {
        response: null,
        token: null,
        userName: null,
        loading: false,
        error: null,
      };
    });
    yield put(updateAuthSliceState(nextState));
  }
}

function* switchToGuestUserAsync(
  action: PayloadAction<{userName: string; token: string}>,
) {
  const baseState = store.getState().auth;
  const {
    payload: {token, userName},
  } = action;

  const nextState = produce(baseState, draftState => {
    draftState.yatri = {
      error: null,
      loading: false,
      response: null,
      token: token,
      userName: userName,
      sessionId: draftState.yatri.sessionId,
    };
    draftState.config = {
      isGuestUserActive: true,
      sessionId: baseState.yatri.sessionId!,
      guestUserInfo: {
        token: token,
        userName: userName,
      },
      primaryUserInfo: {
        token: baseState.yatri.token!,
        userName: baseState.yatri.userName!,
      },
    };
  });

  yield call(insertDataIntoAsyncStorage, nextState.config);
  yield put(updateAuthSliceState(nextState));
}

function* switchToMainUserAsync() {
  const baseState = store.getState().auth;
  const nextState = produce(baseState, draftState => {
    draftState.config.isGuestUserActive = false;
    draftState.config.guestUserInfo = null;
    draftState.yatri = {
      error: null,
      loading: false,
      response: null,
      token: draftState.config.primaryUserInfo?.token || null,
      userName: draftState.config.primaryUserInfo?.userName || null,
      sessionId: draftState.config.sessionId,
    };
  });
  yield call(insertDataIntoAsyncStorage, nextState.config);
  yield put(updateAuthSliceState(nextState));
}

function* onlogoutAsync() {
  yield call(AsyncStorage.removeItem, AsyncStorageKeysEnum.YATRI_AUTH_CONFIG);
}

function* takeActions() {
  yield takeEvery(loginYatri.type, getYatriLoginAsync);
  yield takeEvery(logoutYatri.type, onlogoutAsync);
  yield takeEvery(loadYatriAuthData.type, loadYatriAuthDataAsync);
  yield takeEvery(switchToGuestUser.type, switchToGuestUserAsync);
  yield takeEvery(switchToMainUser.type, switchToMainUserAsync);
}

export default function* authSagaRoot() {
  yield all([takeActions()]);
}
