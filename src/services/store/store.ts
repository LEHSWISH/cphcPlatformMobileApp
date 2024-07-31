import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import authReducer from './slices/authSlice';
import yatriReducer from './slices/yatriSlice';
import helperReducer from './slices/helperSlice';
import rootSaga from './sagas/rootSagas';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

export const store = configureStore({
  reducer: {
    helper: helperReducer,
    auth: authReducer,
    yatri: yatriReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
