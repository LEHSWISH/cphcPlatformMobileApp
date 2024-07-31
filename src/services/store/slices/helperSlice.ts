import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface SnackBarPayloadType {
  visible: boolean;
  message: string | null;
  duration?: number;
}

interface HelperStateType {
  snackbar: SnackBarPayloadType;
}

const initialState: HelperStateType = {
  snackbar: {
    visible: false,
    message: null,
  },
};

export const helperSlice = createSlice({
  name: 'HELPER',
  initialState,
  reducers: {
    setSnackBar: (state, action: PayloadAction<SnackBarPayloadType>) => {
      state.snackbar.visible = action.payload.visible;
      state.snackbar.message = action.payload.message;
      state.snackbar.duration = action.payload.duration;
    },
  },
});

export const {setSnackBar} = helperSlice.actions;

const helperReducer = helperSlice.reducer;

export default helperReducer;
