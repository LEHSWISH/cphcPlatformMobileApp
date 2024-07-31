/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import {Snackbar, TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NHMandUKGovtLogoImage} from '../../assets/images';
import {UnAuthenticatedStackParamList} from '../../navigation/stack/UnAuthenticatedStack';
import HitApi from '../../classes/http/HitApi';
import {RequestMethod} from '../../enums/requestMethod/RequestMethod';
import {passwordValidationScheme} from '../../validations/createNewPassword/createNewPasswordValidation';
import {ApiEndpoints} from '../../enums/api/apiEndpointsEnum';
import {sha256} from 'react-native-sha256';

let ScreenHeight = Dimensions.get('window').height;

type CreateNewPasswordProps = NativeStackScreenProps<
  UnAuthenticatedStackParamList,
  'CreateNewPassword'
>;
const ForgotPassword = ({navigation, route}: CreateNewPasswordProps) => {
  const [snackbarVissible, setSnackbarVissible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const hideSnackbar = () => {
    setSnackbarVissible(false);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView>
        <View style={{height: ScreenHeight * 0.6}}>
          <View style={[styles.alignCenter, styles.logo]}>
            <NHMandUKGovtLogoImage />
            <Text style={[styles.alignCenter, styles.resetPasswordText]}>
              Reset Password
            </Text>
          </View>
          <Formik
            validationSchema={passwordValidationScheme}
            initialValues={{password: '', confirmPassword: ''}}
            onSubmit={async values => {
              let hashedPassword;
              if (values.password) {
                await sha256(values.password)
                  .then(hash => {
                    hashedPassword = hash;
                  })
                  .catch();
              }
              if (hashedPassword !== undefined || null) {
                let payload = {
                  ...route.params,
                  password: hashedPassword,
                };
                HitApi.hitapi({
                  url: `${ApiEndpoints.RESET_PASSWORD}`,
                  requestMethod: RequestMethod.POST,
                  ignoreBaseUrl: false,
                  payload: payload,
                  sucessFunction: (response: any) => {
                    setSnackbarMessage(
                      response?.data?.message
                        ? response?.data?.message
                        : 'Password changed  successfully',
                    );
                    setSnackbarVissible(true);
                    navigation.navigate('Login');
                  },
                  errorFunction: (error: any) => {
                    setSnackbarMessage(
                      error?.data?.message
                        ? error?.data?.message
                        : 'Password changed failed',
                    );
                    setSnackbarVissible(true);
                  },
                });
              }
            }}>
            {({handleChange, handleSubmit, values, errors, touched}) => (
              <View>
                <TextInput
                  style={{
                    backgroundColor: '#fff',
                    color: '#202020',
                    margin: 12,
                  }}
                  label={
                    <Text>
                      Password
                      <Text style={{color: '#C7413A', fontSize: 16}}> *</Text>
                    </Text>
                  }
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={toggleShowPassword}
                    />
                  }
                  secureTextEntry={!showPassword}
                  mode="flat"
                  placeholder="Create new password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                />
                {errors?.password && touched.password && (
                  <Text style={styles.errorText}>{errors?.password}</Text>
                )}
                <TextInput
                  style={{
                    backgroundColor: '#fff',
                    color: '#202020',
                    margin: 12,
                  }}
                  label={
                    <Text>
                      Confirm Password
                      <Text style={{color: '#C7413A', fontSize: 16}}> *</Text>
                    </Text>
                  }
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? 'eye-off' : 'eye'}
                      onPress={toggleShowConfirmPassword}
                    />
                  }
                  secureTextEntry={!showConfirmPassword}
                  mode="flat"
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                />
                {errors?.confirmPassword && touched.confirmPassword && (
                  <Text style={styles.errorText}>
                    {errors?.confirmPassword}
                  </Text>
                )}
                {/* <Button mode="contained">Send OTP</Button> */}
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() => {
                    handleSubmit();
                  }}>
                  <Text style={styles.continueButtonText}>Reset Password</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.textButton}>Back to Log In</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
        <Snackbar visible={snackbarVissible} onDismiss={hideSnackbar}>
          {snackbarMessage}
        </Snackbar>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  alignCenter: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  resetPasswordText: {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: '600',
    color: '#202020',
  },
  resetPasswordDescription: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: '#6C6969',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textButton: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    color: '#33189F',
    textDecorationLine: 'underline',
    marginHorizontal: 20,
  },
  continueButton: {
    backgroundColor: '#33189F',
    borderRadius: 8,
    margin: 35,
    paddingHorizontal: 58,
    paddingVertical: 8,
  },
  continueButtonText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    color: '#C7413A',
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 10,
    paddingLeft: 25,
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
  },
  passwordCheckerDescription: {
    paddingHorizontal: 20,
  },
});
