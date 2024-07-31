import {Action, PayloadAction, createSlice} from '@reduxjs/toolkit';
import {YatriAllDetailsResponseType} from '../../../interfaces/apiResponseTypes/YatriAllDetailsResponseType';

interface LogoutAction extends Action {}
function isLogoutAction(action: Action): action is LogoutAction {
  return action.type.includes('logout');
}

interface YatriState {
  yatriAllDetails: {
    data: YatriAllDetailsResponseType | null;
    status: 'idle' | 'initialLoading' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  abhaCardDetails: {
    abhaCardImage: string | null;
    abhaCardPdfUrl: string | null;
    abhaNumber?: string | null;
  };
}

const initialState: YatriState = {
  yatriAllDetails: {
    data: null,
    status: 'idle',
    error: null,
  },
  abhaCardDetails: {
    abhaCardImage: null,
    abhaCardPdfUrl: null,
    abhaNumber: null,
  },
};

export const yatriSlice = createSlice({
  name: 'YATRI',
  initialState,
  reducers: {
    showYatriAllDataSuccess: (
      state,
      action: PayloadAction<YatriAllDetailsResponseType>,
    ) => {
      state.yatriAllDetails = {
        data: action.payload,
        error: null,
        status: 'succeeded',
      };
    },
    showYatriAllDataFailed: (state, action: PayloadAction<string>) => {
      state.yatriAllDetails = {
        data: null,
        error: action.payload || 'Something went wrong',
        status: 'failed',
      };
    },
    loadYatriAllData: state => {
      state.yatriAllDetails = {
        data: state?.yatriAllDetails?.data,
        error: null,
        status:
          state.yatriAllDetails.status === 'idle'
            ? 'initialLoading'
            : 'loading',
      };
    },
    setAbhaCardDetails: (
      state,
      action: PayloadAction<{
        abhaCardImage?: string | null;
        abhaCardPdfUrl?: string | null;
        abhaNumber?: string | null;
      }>,
    ) => {
      state.abhaCardDetails = {
        abhaCardImage: action.payload.abhaCardImage
          ? action.payload.abhaCardImage
          : state.abhaCardDetails.abhaCardImage,
        abhaCardPdfUrl: action.payload.abhaCardPdfUrl
          ? action.payload.abhaCardPdfUrl
          : state.abhaCardDetails.abhaCardPdfUrl,
        abhaNumber: action?.payload?.abhaNumber
          ? action?.payload?.abhaNumber
          : state.abhaCardDetails.abhaNumber,
      };
    },
  },
  extraReducers: builder => {
    builder.addMatcher(isLogoutAction, state => {
      state = initialState;
      return state;
    });
  },
});

export const {
  showYatriAllDataSuccess,
  showYatriAllDataFailed,
  loadYatriAllData,
  setAbhaCardDetails,
} = yatriSlice.actions;

const yatriReducer = yatriSlice.reducer;

export default yatriReducer;
