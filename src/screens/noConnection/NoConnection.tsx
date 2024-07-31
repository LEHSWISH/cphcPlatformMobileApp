import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import AppText from '../../components/shared/text/AppText';
import {NoConnectionImage} from '../../assets/images';
import {variable} from '../../styles/colors';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import {refresh} from '@react-native-community/netinfo';

const NoConnection = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View>
        <NoConnectionImage style={styles.noConnectionImage} />
        <AppText customStyles={styles.heading}>No internet connection </AppText>
        <AppText customStyles={styles.description}>
          Please check your internet connection and try again
        </AppText>
        <ButtonComponent
          label="Retry"
          onPress={() => {
            refresh();
            Alert.alert('Please Check your Internet connection');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default NoConnection;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: variable.whiteBackground,
  },
  noConnectionImage: {
    alignSelf: 'center',
    marginVertical: 35,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginHorizontal: 70,
  },
});
