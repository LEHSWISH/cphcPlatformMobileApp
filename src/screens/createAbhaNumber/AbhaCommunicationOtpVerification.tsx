import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../styles';
import {Formik} from 'formik';
import {TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import AbhaCreationAPI from '../../services/ApiHelpers/AbhaCreationAPI';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {
  loadYatriAllData,
  setAbhaCardDetails,
} from '../../services/store/slices/yatriSlice';
import FullScreenLoader from '../../components/shared/FullScreenLoader';
import {abhaCommunicationOtpValidationScheme} from '../../validations/createAbhaViaAadhaar/AbhaViaAadhaarValidation';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import {ButtonType} from '../../enums/buttonType/ButtonType';
import {isAxiosError} from 'axios';
import {t} from 'i18next';
import {setSnackBar} from '../../services/store/slices/helperSlice';

type AbhaCommunicationOtpVerificationPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'AbhaCommunicationOtpVerification'
>;

const AbhaCommunicationOtpVerification = ({
  navigation,
  route,
}: AbhaCommunicationOtpVerificationPropTypes) => {
  const [timer, setTimer] = useState(59);
  const [started, setStarted] = useState(true);
  const [isResetButtonDisabled, setIsResetButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
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

  const startTimer = (mobile: string) => {
    setIsResetButtonDisabled(true);
    setIsLoading(true);
    AbhaCreationAPI.AbhaCreationGenerateMobileOtpApi({
      mobile,
      txnId: route?.params?.txnId,
    })
      .then(() => {
        setTimer(59);
        setStarted(true);
      })
      .catch(error => {
        let message = 'Something went wrong, Please try again';
        if (isAxiosError(error) && error.response?.data?.message) {
          message = error.response?.data?.message;
        }
        dispatch(
          setSnackBar({
            message,
            visible: true,
          }),
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formatTimer = () => {
    return timer < 10 ? `0${timer}` : timer;
  };

  const phoneNumber = route?.params?.phoneNumber
    ? route?.params.phoneNumber.slice(-4)
    : 'XXXX';
  const isNew = route?.params?.response?.data?.new;
  return (
    <>
      {isLoading && <FullScreenLoader />}
      <SafeAreaView style={styles.wrapper}>
        <Formik
          validationSchema={abhaCommunicationOtpValidationScheme}
          initialValues={{abhaCommunicationOtp: ''}}
          onSubmit={values => {
            if (
              values.abhaCommunicationOtp === '' ||
              values.abhaCommunicationOtp.length !== 6
            ) {
              return;
            }
            setIsLoading(true);
            AbhaCreationAPI.AbhaCreationVerifyMobileOtpApi({
              mobile: route?.params?.phoneNumber,
              otp: values.abhaCommunicationOtp,
              txnId: route?.params?.txnId,
            })
              .then(() => {
                if (isNew) {
                  navigation.navigate('CreateAbhaAddress', {
                    txnId: route?.params?.txnId,
                    abhaToken:
                      route?.params?.response?.data?.tokens?.token || '',
                    authType: route?.params?.response?.data?.authType,
                    aadharNumber: route?.params?.aadhaarCardNumber,
                  });
                } else {
                  dispatch(
                    setAbhaCardDetails({
                      abhaCardImage:
                        route?.params?.response?.data?.preSignedUrl,
                      abhaCardPdfUrl:
                        route?.params?.response?.data.preSignedUrl,
                      abhaNumber: route?.params?.response?.data.ABHANumber,
                    }),
                  );
                  dispatch(loadYatriAllData());
                  navigation.popToTop();
                  navigation.navigate('Abha');
                }
              })
              .catch(error => {
                let message = t('common_error_messages.something_went_wrong');
                if (isAxiosError(error) && error.response?.data?.message) {
                  message = error.response?.data?.message;
                }
                dispatch(
                  setSnackBar({
                    message,
                    visible: true,
                  }),
                );
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}>
          {({handleChange, handleSubmit, values, errors, touched}) => (
            <>
              <View style={styles.sectionOne}>
                <Text style={styles.stepsStyle}>Step 2 of 3</Text>
                <Text style={styles.sectionDescription}>
                  Enter the OTP sent on XXXXXX{phoneNumber}
                </Text>
                <View>
                  <TextInput
                    style={styles.formInputStyle}
                    label={
                      <Text>
                        OTP
                        <Text style={styles.asteriskStyle}> *</Text>
                      </Text>
                    }
                    mode="flat"
                    placeholder="- - - - - -"
                    value={values.abhaCommunicationOtp}
                    onChangeText={handleChange('abhaCommunicationOtp')}
                    keyboardType="numeric"
                    error={errors?.abhaCommunicationOtp ? true : false}
                  />
                  {errors?.abhaCommunicationOtp &&
                  touched.abhaCommunicationOtp ? (
                    <Text style={styles.errorText}>
                      {errors?.abhaCommunicationOtp}
                    </Text>
                  ) : null}
                  <View style={styles.resendOtp}>
                    <Text>Resend OTP in 00:{formatTimer()}</Text>
                    <ButtonComponent
                      type={ButtonType.TEXT_BUTTON}
                      label="Resend"
                      onPress={() => {
                        startTimer(values.abhaCommunicationOtp);
                      }}
                      touchableOpacityProps={{disabled: isResetButtonDisabled}}
                      customButtonStyle={isResetButtonDisabled && styles.faded}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.sectionTwo}>
                <ButtonComponent
                  label="Verify & Continue"
                  onPress={() => {
                    handleSubmit();
                  }}
                />
                <View style={styles.linkAbha}>
                  <Text>Already have ABHA number? </Text>
                  <ButtonComponent
                    type={ButtonType.TEXT_BUTTON}
                    label="Link ABHA"
                    onPress={() => {}}
                  />
                </View>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </>
  );
};

export default AbhaCommunicationOtpVerification;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  sectionOne: {
    flex: 0.8,
  },
  sectionTwo: {
    flex: 0.22,
  },
  stepsStyle: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    color: Colors.neutral.s500,
    paddingTop: 35,
  },
  sectionDescription: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    color: Colors.primary.textColor,
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  sectionDescriptionTwo: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    color: Colors.primary.textColor,
    paddingHorizontal: 15,
    paddingVertical: 40,
  },
  formInputStyle: {
    backgroundColor: '#fff',
    color: '#202020',
    margin: 12,
  },
  asteriskStyle: {
    color: Colors.warning.asterisk,
    fontSize: 16,
  },
  errorText: {
    color: Colors.warning.error,
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 10,
    paddingLeft: 25,
  },
  resendOtp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },

  linkAbha: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  faded: {
    opacity: 0.4,
  },
});
