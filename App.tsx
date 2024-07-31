/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Provider as StoreProvider} from 'react-redux';
import {Provider as RnpProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {getLocales} from 'react-native-localize';
import i18next from 'i18next';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';

import './src/services/i18n/config';
import customTheme from './src/styles/customTheme';
import Snackbar from './src/components/shared/Snackbar';
import {store} from './src/services/store/store';
import MainNavigation from './src/navigation/MainNavigation';
import SplashScreen from 'react-native-splash-screen';
import {useNetInfo} from '@react-native-community/netinfo';

/*
As per react native paper documentation(https://web-ridge.github.io/react-native-paper-dates/docs/intro/)
React-Native-Paper-Dates currently supports
ar/ca/de/en/en-GB/es/fr/he/hi/it/ko/nl/pl/pt/tr/zh/zh-TW/cs/el/ru/ro translations. I
deally you would do this somewhere before react-native-paper-dates is used.
*/
import {en, registerTranslation} from 'react-native-paper-dates';
import NoConnection from './src/screens/noConnection/NoConnection';

registerTranslation('en', en);

function App(): React.JSX.Element {
  const netInfo = useNetInfo();
  const isInternetConnected = netInfo.isConnected;

  useEffect(() => {
    SplashScreen.hide();
  }, []);
  useEffect(() => {
    // Set the initial language based on device locale
    const locale = getLocales()?.[0]?.languageCode;
    locale && i18next.changeLanguage(locale);
  }, []);

  return (
    <StoreProvider store={store}>
      <RnpProvider theme={customTheme}>
        <SafeAreaProvider>
          {isInternetConnected === true ? (
            <>
              <MainNavigation />
              <Snackbar />
            </>
          ) : (
            <NoConnection />
          )}
        </SafeAreaProvider>
      </RnpProvider>
    </StoreProvider>
  );
}

export default App;
