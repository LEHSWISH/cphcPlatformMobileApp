import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import {TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UnAuthenticatedStackParamList} from '../../navigation/stack/UnAuthenticatedStack';
import {NHMandUKGovtLogoImage} from '../../assets/images';
import HitApi from '../../classes/http/HitApi';
import {RequestMethod} from '../../enums/requestMethod/RequestMethod';
import {ApiEndpoints} from '../../enums/api/apiEndpointsEnum';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {Colors} from '../../styles';

type ForgotPasswordProps = NativeStackScreenProps<
  UnAuthenticatedStackParamList,
  'ForgotPassword'
>;
const ForgotPassword = ({navigation}: ForgotPasswordProps) => {
  const dispatch = useAppDispatch();

  function sendOtpApi(payload: any) {
    HitApi.hitapi({
      url: `${ApiEndpoints.SEND_OTP}`,
      requestMethod: RequestMethod.POST,
      ignoreBaseUrl: false,
      payload: payload,
      sucessFunction: (response: any) => {
        if (response?.status === 200) {
          dispatch(
            setSnackBar({
              message: response?.data?.message
                ? response?.data?.message
                : 'Otp send successfully',
              visible: true,
            }),
          );
          navigation.navigate('SendOtp', {
            userName: payload?.userName,
            phoneNumber: payload?.phoneNumber,
            isNavigate: true,
            navigationToScreen: 'Login',
            submitButtonName: 'Continue',
            snackbarMessage: 'Signed up successfully!',
            backButtonName: 'Back to Log in',
            templateKey: 'reset-password',
          });
        }
      },
      errorFunction: (error: any) => {
        dispatch(
          setSnackBar({
            visible: true,
            message: error?.data?.message
              ? error?.data?.message
              : 'Otp send failed',
          }),
        );
      },
    });
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        automaticallyAdjustKeyboardInsets={true}>
        <View style={[styles.alignCenter, styles.logo]}>
          <NHMandUKGovtLogoImage />
          <Text style={[styles.alignCenter, styles.resetPasswordText]}>
            Reset Password
          </Text>
          <Text style={styles.resetPasswordDescription}>
            Enter your username and phone number and we’ll send OTP to reset
            your password
          </Text>
        </View>
        <Formik
          // validationSchema={}
          initialValues={{userName: '', phoneNumber: ''}}
          onSubmit={values => {
            let sendOtpPayload = {
              ...values,
              templateKey: 'reset-password',
            };
            HitApi.hitapi({
              url: `${ApiEndpoints.PHONE_NUMBER_VALIDATE}`,
              requestMethod: RequestMethod.POST,
              ignoreBaseUrl: false,
              payload: sendOtpPayload,
              sucessFunction: (response: any) => {
                if (response?.status === 200) {
                  //  Otp send api calling
                  sendOtpApi(sendOtpPayload);
                }
              },
              errorFunction: (error: any) => {
                dispatch(
                  setSnackBar({
                    visible: true,
                    message: error?.data?.message
                      ? error?.data?.message
                      : 'This phone number is not linked with any username.',
                  }),
                );
              },
            });
          }}>
          {({handleChange, handleSubmit, values, errors}) => (
            <>
              <TextInput
                style={styles.inputField}
                label={
                  <Text>
                    Username
                    <Text style={styles.asteriskStyle}> *</Text>
                  </Text>
                }
                mode="flat"
                placeholder="Enter your unique username"
                value={values.userName}
                onChangeText={handleChange('userName')}
              />
              {errors?.userName && (
                <Text style={styles.errorText}>{errors?.userName}</Text>
              )}
              <TextInput
                style={styles.inputField}
                label={
                  <Text>
                    Phone Number
                    <Text style={styles.asteriskStyle}> *</Text>
                  </Text>
                }
                mode="flat"
                placeholder="Enter you phone number"
                value={values.phoneNumber}
                onChangeText={handleChange('phoneNumber')}
                keyboardType="numeric"
              />
              {errors?.phoneNumber && (
                <Text style={styles.errorText}>{errors?.phoneNumber}</Text>
              )}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  handleSubmit();
                }}>
                <Text style={styles.continueButtonText}>Send OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={styles.textButton}>Back to Log In</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.variable.whiteBackground,
  },
  contentContainerStyle: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    flexGrow: 1,
    gap: 24,
  },
  asteriskStyle: {
    color: Colors.variable.danger,
    fontSize: 16,
  },
  alignCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  resetPasswordText: {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: '600',
    color: Colors.variable.blackTextColor,
  },
  resetPasswordDescription: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.variable.descriptionText,
    textAlign: 'center',
  },
  textButton: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    color: Colors.variable.primary,
    textDecorationLine: 'underline',
  },
  inputField: {
    backgroundColor: Colors.variable.whiteBackground,
    color: Colors.variable.blackTextColor,
  },
  continueButton: {
    backgroundColor: Colors.variable.primary,
    borderRadius: 8,
    marginHorizontal: 35,
    marginTop: 'auto',
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
    color: Colors.variable.danger,
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 10,
    paddingLeft: 25,
  },
  logo: {
    justifyContent: 'center',
    gap: 20,
  },
});
