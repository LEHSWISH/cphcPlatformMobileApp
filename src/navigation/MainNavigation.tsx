import React, {useEffect, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {loadYatriAuthData} from '../services/store/slices/authSlice';
import {loadYatriAllData} from '../services/store/slices/yatriSlice';
import {useAppDispatch} from '../components/shared/hooks/useAppDispatch';
import {useAppSelector} from '../components/shared/hooks/useAppSelector';
import FullScreenLoader from '../components/shared/FullScreenLoader';
import UnauthenticatedStack from './stack/UnAuthenticatedStack';
import TabNavigator from './tabNavigator/TabNavigator';

const MainNavigation = () => {
  const dispatch = useAppDispatch();
  const {loading, token} = useAppSelector(s => s.auth.yatri);

  const yatriDataStatus = useAppSelector(s => s.yatri.yatriAllDetails.status);

  useEffect(() => {
    dispatch(loadYatriAuthData());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && token && yatriDataStatus === 'idle') {
      dispatch(loadYatriAllData());
    }
  }, [dispatch, yatriDataStatus, token, loading]);

  const isShowFullScreenLoader = useMemo(
    () =>
      loading ||
      (token &&
        (yatriDataStatus === 'loading' ||
          yatriDataStatus === 'initialLoading')),
    [loading, token, yatriDataStatus],
  );

  // we should avoid mounting AuthenticatedNavigation before get-all-user-details
  // request gets settled as it decides what will be our first screen
  const isUseAuthenticatedNavigation = useMemo(
    () =>
      token &&
      yatriDataStatus !== 'idle' &&
      yatriDataStatus !== 'initialLoading',
    [token, yatriDataStatus],
  );

  return (
    <React.Fragment>
      {isShowFullScreenLoader && <FullScreenLoader />}
      <NavigationContainer>
        {isUseAuthenticatedNavigation ? (
          <TabNavigator />
        ) : (
          <UnauthenticatedStack />
        )}
      </NavigationContainer>
    </React.Fragment>
  );
};

export default MainNavigation;
