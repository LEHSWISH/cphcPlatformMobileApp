import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import {TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UnAuthenticatedStackParamList} from '../../../navigation/stack/UnAuthenticatedStack';
import AuthenticationAPI, {
  ResendOtpForAuthApiPayloadType,
  SignupApiPayloadType,
} from '../../../services/ApiHelpers/AuthenticationAPI';
import {TemplateKeyEnum} from '../../../enums/api/authTemplateKeyEnum';
import {useAppDispatch} from '../hooks/useAppDispatch';
import {setSnackBar} from '../../../services/store/slices/helperSlice';
import {useTranslation} from 'react-i18next';
import {loginYatri} from '../../../services/store/slices/authSlice';
import {NHMandUKGovtLogoImage} from '../../../assets/images';
import bcrypt from 'bcryptjs';
import {encryption} from '../../../utils/Helper';
import {ENCRPTION_SALT} from '../../../utils/constants/Constant';

let ScreenHeight = Dimensions.get('window').height;

const initialValues = {otp: ''};

type OtpProps = NativeStackScreenProps<
  UnAuthenticatedStackParamList,
  'SendOtp'
>;
const SendOtp = ({navigation, route}: OtpProps) => {
  const dispatch = useAppDispatch();
  const [timer, setTimer] = useState(59);
  const [started, setStarted] = useState(true);
  const [isResetButtonDisabled, setIsResetButtonDisabled] = useState(true);
  const {t} = useTranslation();
  const Phonenumber = route?.params?.phoneNumber;

  useEffect(() => {
    let intervalId: any;
    if (started) {
      setIsResetButtonDisabled(true);
      intervalId = setInterval(() => {
        setTimer(() => {
          if (timer <= 0) {
            setIsResetButtonDisabled(false);
            clearInterval(intervalId);
          }
          return timer > 0 ? timer - 1 : 0;
        });
      }, 1000);
    }
    // Cleanup function to clear the interval when the component unmounts or when timer is stopped
    return () => {
      clearInterval(intervalId);
      setIsResetButtonDisabled(false);
    };
  }, [started, timer]);

  const startTimer = () => {
    setIsResetButtonDisabled(true);
    setTimer(59);
    setStarted(true);
    let resetOtpPayload = {
      userName: route?.params?.userName,
      phoneNumber: Phonenumber,
      templateKey:
        route?.params?.templateKey === 'sign-up'
          ? TemplateKeyEnum.SIGN_UP
          : TemplateKeyEnum.RESET_PASSWORD,
    };
    resendOTP(resetOtpPayload);
  };

  const formatTimer = () => {
    return timer < 10 ? `0${timer}` : timer;
  };
  const onSignUp = useCallback(
    async (values: typeof initialValues) => {
      if (route?.params?.templateKey === 'reset-password') {
        navigation.navigate('CreateNewPassword', {
          ...route?.params,
          ...values,
        });
      } else {
        let payload: SignupApiPayloadType = {
          userName: route?.params?.userName,
          password: route?.params?.password || '',
          phoneNumber: Phonenumber,
          otp: values.otp,
          licenseAgreement: true,
          templateKey: TemplateKeyEnum.SIGN_UP,
        };

        let hashedPassword: string = '';
        if (payload.password) {
          let salt = ENCRPTION_SALT;
          hashedPassword = await bcrypt.hashSync(payload.password, salt);
        }
        const timeStamp = new Date().toISOString();
        const encryptedPassword = `${timeStamp}%${hashedPassword}`;
        if (hashedPassword) {
          await AuthenticationAPI.signUp({
            ...payload,
            password: encryption(encryptedPassword).toString(),
          })
            .then(() => {
              dispatch(
                setSnackBar({
                  message: 'Sign-up Successfully!',
                  visible: true,
                }),
              );
              dispatch(
                loginYatri({
                  userName: payload.userName,
                  password: payload.password,
                  redirectFromRegistration: true,
                }),
              );
              navigation.replace('Login');
            })
            .catch(error => {
              let message = 'Sign-up Failed!';
              if (error?.response?.data?.message) {
                message = error?.response?.data?.message;
              }
              dispatch(
                setSnackBar({
                  message,
                  visible: true,
                }),
              );
            });
        } else {
          dispatch(
            setSnackBar({
              message: t('common_error_messages.something_went_wrong'),
              visible: true,
            }),
          );
        }
      }
    },
    [Phonenumber, dispatch, navigation, route?.params, t],
  );

  const resendOTP = useCallback(
    (args: ResendOtpForAuthApiPayloadType) => {
      AuthenticationAPI.resendOtpForAuth(args)
        .then(() => {
          dispatch(
            setSnackBar({
              visible: true,
              message: 'OTP send Successfully',
            }),
          );
        })
        .catch(error => {
          if (error?.data?.message) {
            console.error(error?.data?.message);
          } else {
            dispatch(
              setSnackBar({
                visible: true,
                message: t('common_error_messages.something_went_wrong'),
              }),
            );
          }
        });
    },
    [dispatch, t],
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <View style={{height: ScreenHeight * 0.6}}>
          <View style={[styles.alignCenter, styles.logo]}>
            <NHMandUKGovtLogoImage />
            <Text style={[styles.alignCenter, styles.resetPasswordText]}>
              {route?.params?.screenTitle}
            </Text>
            <Text style={styles.resetPasswordDescription}>
              Enter the OTP sent to XXXXXX
              {Phonenumber ? Phonenumber.slice(-4) : ''}{' '}
              {route?.params?.templateKey === 'reset-password'
                ? 'to reset your password'
                : ''}
            </Text>
          </View>
          <Formik
            // validationSchema={}
            initialValues={initialValues}
            onSubmit={onSignUp}>
            {({handleChange, handleSubmit, values, errors}) => (
              <View>
                <TextInput
                  style={styles.otpTextInput}
                  label={
                    <Text>
                      OTP
                      <Text style={styles.asterisk}> *</Text>
                    </Text>
                  }
                  mode="flat"
                  placeholder="-  -  -  -  -  -"
                  value={values.otp}
                  onChangeText={handleChange('otp')}
                  keyboardType="numeric"
                />
                {errors?.otp && (
                  <Text style={styles.errorText}>{errors?.otp}</Text>
                )}
                <View style={styles.resendOtp}>
                  <Text>Resend OTP in 00:{formatTimer()}</Text>
                  <TouchableOpacity
                    disabled={isResetButtonDisabled}
                    onPress={() => {
                      startTimer();
                    }}>
                    <Text
                      style={[
                        styles.resendButton,
                        isResetButtonDisabled ? styles.faded : null,
                      ]}>
                      Resend
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() => {
                    handleSubmit();
                  }}>
                  <Text style={styles.continueButtonText}>
                    {route?.params?.submitButtonName}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.textButton}>
                    {route?.params?.backButtonName}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendOtp;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#202020',
  },
  resetPasswordDescription: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: '#6C6969',
    textAlign: 'center',
    width: '85%',
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
  resendButton: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    color: '#33189F',
    textDecorationLine: 'underline',
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
  otpTextInput: {
    backgroundColor: '#fff',
    color: '#202020',
    margin: 12,
  },
  asterisk: {color: '#C7413A', fontSize: 16},
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
  resendOtp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  faded: {
    opacity: 0.4,
  },
});
