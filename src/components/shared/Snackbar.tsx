import React, {useCallback} from 'react';
import {Snackbar as SnackbarRNP} from 'react-native-paper';
import {useAppSelector} from './hooks/useAppSelector';
import {useAppDispatch} from './hooks/useAppDispatch';
import {setSnackBar} from '../../services/store/slices/helperSlice';

const Snackbar = () => {
  const {message, visible, duration} = useAppSelector(s => s.helper.snackbar);
  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    dispatch(
      setSnackBar({
        message: null,
        visible: false,
        duration: undefined,
      }),
    );
  }, [dispatch]);

  return (
    <SnackbarRNP visible={visible} onDismiss={handleClose} duration={duration}>
      {message}
    </SnackbarRNP>
  );
};

export default Snackbar;
