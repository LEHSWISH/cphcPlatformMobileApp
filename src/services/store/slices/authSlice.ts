import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  LoginApiPayloadType,
  LoginApiResponseType,
} from '../../ApiHelpers/AuthenticationApi';

interface UserAuthConfigInfoType {
  token: string;
  userName: string;
}

export interface UserAuthConfigType {
  isGuestUserActive: boolean;
  primaryUserInfo: UserAuthConfigInfoType | null;
  guestUserInfo: UserAuthConfigInfoType | null;
  sessionId: string | null;
}

interface AuthState {
  yatri: {
    response: LoginApiResponseType | unknown;
    token: string | null;
    userName: string | null;
    loading: boolean;
    error: string | null;
    sessionId?: string | null;
  };
  config: UserAuthConfigType;
}

const initialState: AuthState = {
  yatri: {
    response: null,
    token: null,
    userName: null,
    loading: false,
    error: null,
  },
  config: {
    isGuestUserActive: false,
    primaryUserInfo: null,
    guestUserInfo: null,
    sessionId: null,
  },
};

export const authSlice = createSlice({
  name: 'AUTH',
  initialState,
  reducers: {
    loadYatriAuthData: state => {
      state.yatri = {
        response: null,
        token: null,
        userName: null,
        loading: true,
        error: null,
      };
    },
    loginYatri: (state, _action: PayloadAction<LoginApiPayloadType>) => {
      state.yatri = {
        response: null,
        token: null,
        userName: null,
        loading: true,
        error: null,
        sessionId: _action?.payload?.sessionId,
      };
    },
    logoutYatri: state => {
      state.yatri = {
        response: null,
        token: null,
        userName: null,
        loading: false,
        error: null,
      };
    },
    switchToGuestUser: (
      state,
      _action: PayloadAction<{userName: string; token: string}>,
    ) => {
      state.yatri.loading = true;
      state.yatri.error = null;
      state.yatri.response = null;
    },
    switchToMainUser: state => {
      state.yatri.loading = true;
      state.yatri.error = null;
      state.yatri.response = null;
    },
    updateAuthSliceState: (state, action: PayloadAction<AuthState>) => {
      state = action.payload;
      return state;
    },
  },
});

export const {
  logoutYatri,
  loginYatri,
  loadYatriAuthData,
  switchToGuestUser,
  switchToMainUser,
  updateAuthSliceState,
} = authSlice.actions;

const authReducer = authSlice.reducer;

export default authReducer;
