import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native';
import {Colors} from '../../styles';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UnAuthenticatedStackParamList} from '../../navigation/stack/UnAuthenticatedStack';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import AppText from '../../components/shared/text/AppText';
import {ButtonType} from '../../enums/buttonType/ButtonType';
import {variable} from '../../styles/colors';

const image = require('../../assets/images/landingScreen.png');
type LandingScreenProps = NativeStackScreenProps<
  UnAuthenticatedStackParamList,
  'LandingScreen'
>;
const LandingScreen = ({navigation}: LandingScreenProps) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
          <View style={styles.ctaWrapper}>
            <AppText customStyles={styles.text}>
              Your one-stop health companion
            </AppText>
            <ButtonComponent
              label={'Log In'}
              onPress={() => {
                navigation.replace('Login');
              }}
              customButtonStyle={styles.loginButtonCustomStyle}
            />
            <View style={styles.divisionSection}>
              <View style={styles.beforeContent} />
              <Text style={styles.orDivision}>OR</Text>
              <View style={styles.afterContent} />
            </View>
            <ButtonComponent
              type={ButtonType.OUTLINE_BUTTON}
              label="Sign Up"
              onPress={() => {
                navigation.replace('Signup');
              }}
            />
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  ctaWrapper: {
    position: 'absolute',
    bottom: '15%',
    left: 0,
    right: 0,
  },
  text: {
    color: Colors.variable.blackTextColor,
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 80,
  },
  orDivision: {
    color: Colors.variable.blackTextColor,
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    textAlign: 'center',
  },
  loginButtonCustomStyle: {
    marginHorizontal: 35,
    marginVertical: 25,
  },
  divisionSection: {
    position: 'relative',
    marginHorizontal: 90,
  },
  beforeContent: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: '40%',
    height: '10%',
    backgroundColor: variable.descriptionText,
  },
  afterContent: {
    position: 'absolute',
    top: 10,
    right: 0,
    width: '40%',
    height: '10%',
    backgroundColor: variable.descriptionText,
  },
});
