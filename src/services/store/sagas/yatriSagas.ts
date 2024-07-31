import {isAxiosError} from 'axios';
import {all, call, put, takeEvery} from 'redux-saga/effects';
import {t} from 'i18next';
import {setSnackBar} from '../slices/helperSlice';
import {
  loadYatriAllData,
  showYatriAllDataFailed,
  showYatriAllDataSuccess,
} from '../slices/yatriSlice';
import YatriDetailsAPI from '../../ApiHelpers/YatriDetailsAPI';
import {YatriAllDetailsResponseType} from '../../../interfaces/apiResponseTypes/YatriAllDetailsResponseType';

function* getYatriAllDataAsync(): unknown {
  try {
    const res = yield call(YatriDetailsAPI.getAllDetails);
    const data = res?.data as YatriAllDetailsResponseType;
    yield put(showYatriAllDataSuccess(data));
  } catch (error) {
    let errorMessage = t('common_error_messages.something_went_wrong');
    if (isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response?.data?.message;
    }
    yield put(showYatriAllDataFailed(errorMessage));
    yield put(
      setSnackBar({
        visible: true,
        message: errorMessage,
      }),
    );
  }
}

function* takeGetYatriAllDataAction() {
  yield takeEvery(loadYatriAllData.type, getYatriAllDataAsync);
}

export default function* yatriSagas() {
  yield all([takeGetYatriAllDataAction()]);
}
