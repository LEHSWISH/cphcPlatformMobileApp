import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../styles';
import {Formik} from 'formik';
import {TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AbhaCreationAPI from '../../services/ApiHelpers/AbhaCreationAPI';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {isAxiosError} from 'axios';
import {t} from 'i18next';
import {encryption} from '../../utils/Helper';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {
  loadYatriAllData,
  setAbhaCardDetails,
} from '../../services/store/slices/yatriSlice';
import FullScreenLoader from '../../components/shared/FullScreenLoader';
import {aadharAuthenticationValidaionSchema} from '../../validations/createAbhaViaAadhaar/AbhaViaAadhaarValidation';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import {ButtonType} from '../../enums/buttonType/ButtonType';

type AadharAuthenticationPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'AadharAuthentication'
>;

const AadharAuthentication = ({
  navigation,
  route,
}: AadharAuthenticationPropTypes) => {
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

  const startTimer = (data: string) => {
    setIsResetButtonDisabled(true);
    setTimer(59);
    setStarted(true);
    setIsLoading(true);
    const encryptedAadhaar = encryption(data).toString();
    // calling api aadhaarotp for resend otp
    AbhaCreationAPI.AbhaCreationGenerateAaadhaarOtpApi({
      aadhaar: encryptedAadhaar,
      consent: true,
    })
      .then(response => {
        dispatch(
          setSnackBar({
            message: response?.data?.message,
            visible: true,
          }),
        );
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
      .finally(() => setIsLoading(false));
  };

  const formatTimer = () => {
    return timer < 10 ? `0${timer}` : timer;
  };

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <SafeAreaView style={styles.wrapper}>
        <Formik
          validationSchema={aadharAuthenticationValidaionSchema}
          initialValues={{otp: '', phoneNumber: ''}}
          onSubmit={values => {
            if (isLoading || values.otp === '' || values.otp.length !== 6) {
              return;
            }

            if (values.phoneNumber === '' || values.phoneNumber.length !== 10) {
              return;
            }
            setIsLoading(true);
            let txnId = route?.params?.txnId;
            let aadhaarCardNumber = route?.params?.aadhaarCardNumber;

            AbhaCreationAPI.AbhaCreationVerifyAaadhaarOtpApi({
              otp: values.otp,
              txnId,
              mobile: values.phoneNumber,
            })
              .then(async response => {
                /**
                        MN : true, isnew: true (createAddress) - check
                        MN: true, isNew : false (card) - caution
                        MN: false, isNew: true (mobileOtp, CreateAddress)
                        MN: false, iseNew: false (mobileOtp, card) -caution
                    */
                if (
                  response?.data?.mobileNumberMatched &&
                  !response?.data?.new
                ) {
                  dispatch(
                    setAbhaCardDetails({
                      abhaCardImage: response.data.preSignedUrl,
                      abhaCardPdfUrl: response.data.preSignedUrl,
                      abhaNumber: response.data.ABHANumber,
                    }),
                  );
                  //  calling two apis here abha card and abha card pdf here first before navigation
                  AbhaCreationAPI.fetchAbhaCard({
                    abhaToken: response.data.tokens?.token || '',
                    authType: response.data.authType,
                    aadharNumber: route?.params?.aadhaarCardNumber,
                  })
                    .then(() => {})
                    .catch(() => {});
                  AbhaCreationAPI.fetchAbhaCardPdf({
                    abhaToken: response.data.tokens?.token || '',
                    authType: response.data.authType,
                    aadharNumber: route?.params?.aadhaarCardNumber,
                  })
                    .then(() => {})
                    .catch(() => {});
                  dispatch(loadYatriAllData());
                  navigation.popToTop();
                  navigation.navigate('Abha');
                } else if (
                  !response?.data?.mobileNumberMatched &&
                  !response?.data?.new
                ) {
                  setIsLoading(true);
                  await AbhaCreationAPI.AbhaCreationGenerateMobileOtpApi({
                    mobile: values.phoneNumber,
                    txnId,
                  })
                    .then(() => {
                      navigation.navigate('AbhaCommunicationOtpVerification', {
                        phoneNumber: values.phoneNumber,
                        txnId,
                        aadhaarCardNumber,
                        response: response,
                      });
                    })
                    .catch(error => {
                      let message = t(
                        'common_error_messages.something_went_wrong',
                      );
                      if (
                        isAxiosError(error) &&
                        error.response?.data?.message
                      ) {
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
                } else if (
                  response?.data?.mobileNumberMatched &&
                  response?.data?.new
                ) {
                  navigation.navigate('CreateAbhaAddress', {
                    txnId,
                    abhaToken: response?.data?.tokens?.token,
                    authType: response?.data?.authType,
                    aadhaarCardNumber,
                    response: response,
                  });
                } else if (
                  !response?.data?.mobileNumberMatched &&
                  response?.data?.new
                ) {
                  // main full flow

                  setIsLoading(true);
                  await AbhaCreationAPI.AbhaCreationGenerateMobileOtpApi({
                    mobile: values.phoneNumber,
                    txnId,
                  })
                    .then(() => {
                      navigation.navigate('AbhaCommunicationOtpVerification', {
                        phoneNumber: values.phoneNumber,
                        txnId,
                        aadhaarCardNumber,
                        response,
                      });
                    })
                    .catch(error => {
                      let message = t(
                        'common_error_messages.something_went_wrong',
                      );
                      if (
                        isAxiosError(error) &&
                        error.response?.data?.message
                      ) {
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
              .finally(() => setIsLoading(false));
          }}>
          {({handleChange, handleSubmit, values, errors, touched}) => (
            <ScrollView>
              <View style={styles.sectionOne}>
                <Text style={styles.stepsStyle}>Step 2 of 3</Text>
                <Text style={styles.sectionDescription}>
                  {route?.params?.response?.message}
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
                    value={values.otp}
                    onChangeText={handleChange('otp')}
                    keyboardType="numeric"
                    error={errors?.otp ? true : false}
                  />
                  {errors?.otp && touched.otp ? (
                    <Text style={styles.errorText}>{errors?.otp}</Text>
                  ) : null}
                  <View style={styles.resendOtp}>
                    <Text>Resend OTP in 00:{formatTimer()}</Text>
                    <ButtonComponent
                      type={ButtonType.TEXT_BUTTON}
                      label="Resend"
                      onPress={() => {
                        startTimer(route?.params?.aadhaarCardNumber);
                      }}
                      touchableOpacityProps={{disabled: isResetButtonDisabled}}
                      customButtonStyle={isResetButtonDisabled && styles.faded}
                    />
                  </View>
                </View>
                <View>
                  <Text style={styles.sectionDescriptionTwo}>
                    Enter your phone number for communication regarding ABHA
                  </Text>
                  <TextInput
                    style={styles.formInputStyle}
                    label={
                      <Text>
                        Phone number
                        <Text style={styles.asteriskStyle}> *</Text>
                      </Text>
                    }
                    mode="flat"
                    placeholder="Enter your phone number"
                    value={values.phoneNumber}
                    onChangeText={handleChange('phoneNumber')}
                    left={<TextInput.Affix text="+91" />}
                    keyboardType="numeric"
                    error={errors?.phoneNumber ? true : false}
                  />
                  {errors?.phoneNumber && touched.phoneNumber ? (
                    <Text style={styles.errorText}>{errors?.phoneNumber}</Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.sectionTwo}>
                <ButtonComponent
                  label=" Verify & Continue"
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
            </ScrollView>
          )}
        </Formik>
      </SafeAreaView>
    </>
  );
};

export default AadharAuthentication;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  keyboardAvoidingStyling: {
    flex: 1,
  },
  sectionOne: {
    flexGrow: 0.8,
  },
  sectionTwo: {
    flexGrow: 0.22,
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
