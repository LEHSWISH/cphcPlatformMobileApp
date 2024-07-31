import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import {ButtonType} from '../../enums/buttonType/ButtonType';
import {AxiosResponse, isAxiosError} from 'axios';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {LinkAbhaMethodEnum} from './LinkAbhaMethodSelection';
import {LinkAbhaSelectOtpMethodSelectionEnum} from './LinkAbhaSelectOtpMethod';

import * as Yup from 'yup';
import LinkAbhaAPI from '../../services/ApiHelpers/LinkAbhaAPI';
import {encryption} from '../../utils/Helper';
import {AbhaGenericResponseType} from '../../interfaces/apiResponseTypes/AbhaGenericResponseType';

export const otpValidationScheme = Yup.object().shape({
  otp: Yup.string().required('Please enter your OTP'),
});

const initialValues = {otp: ''};

export interface LinkAbhaRouteParamsPropType {
  linkAbhaMethod: LinkAbhaMethodEnum;
  linkAbhaOtpRouteSelection: LinkAbhaSelectOtpMethodSelectionEnum | null;
  txnId: string;
  token: string | null;
  authType: string;
  ABHANumber: string | null;
  AbhaAdress: string | null;
  message: string;
  phoneNumber: string | null;
  aadhaarNumber: string | null;
}

type LinkAbhaOtpVerificationPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'LinkAbhaOtpVerification'
>;

const LinkAbhaOtpVerification = ({
  navigation,
  route,
}: LinkAbhaOtpVerificationPropTypes) => {
  const dispatch = useAppDispatch();
  const {params} = route;
  const [timer, setTimer] = useState(59);
  const [started, setStarted] = useState(true);
  const [isResetButtonDisabled, setIsResetButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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

  const errorCatch = useCallback(
    (err: unknown) => {
      let message = 'Something went wrong, Please try again';
      if (isAxiosError(err) && err.response?.data?.errorDetails) {
        if (typeof err.response?.data?.errorDetails === 'string') {
          try {
            const errorDetails = JSON.parse(err.response?.data?.errorDetails);
            message = errorDetails.error.message;
          } catch (_error) {}
        } else {
          message = err.response.data.errorDetails.message;
        }
      } else if (isAxiosError(err) && err.response?.data?.message) {
        message = err.response?.data?.message;
      }
      dispatch(
        setSnackBar({
          visible: true,
          message,
        }),
      );
    },
    [dispatch],
  );

  const startTimer = useCallback(async () => {
    if (params.linkAbhaMethod === LinkAbhaMethodEnum.PHONE) {
      setIsResetButtonDisabled(true);
      setIsLoading(true);
      await LinkAbhaAPI.linkViaPhoneNumberSendOtp({
        mobile: params.phoneNumber!,
      })
        .then(response => {
          setTimer(59);
          setStarted(true);
          navigation.setParams({
            ...params,
            ABHANumber: response.data.ABHANumber,
            authType: response.data.authType!,
            message: response.data.message,
            token: response.data.tokens?.token!,
            txnId: response.data.txnId,
          });
        })
        .catch(errorCatch)
        .finally(() => {
          setIsLoading(false);
        });
    } else if (params.linkAbhaMethod === LinkAbhaMethodEnum.AADHAAR_NUMBER) {
      setIsResetButtonDisabled(true);
      setIsLoading(true);
      const encryptedAadharNumber = encryption(
        params.aadhaarNumber!,
      ).toString();
      await LinkAbhaAPI.linkViaAadhaarNumberRequestOtp({
        aadhaar: encryptedAadharNumber,
      })
        .then(response => {
          setTimer(59);
          setStarted(true);
          navigation.setParams({
            ...params,
            ABHANumber: response.data.ABHANumber,
            authType: response.data.authType!,
            message: response.data.message,
            token: response.data.tokens?.token!,
            txnId: response.data.txnId,
          });
        })
        .catch(errorCatch)
        .finally(() => setIsLoading(false));
    } else if (params.linkAbhaMethod === LinkAbhaMethodEnum.ABHA_NUMBER) {
      if (
        params.linkAbhaOtpRouteSelection ===
        LinkAbhaSelectOtpMethodSelectionEnum.AADHAAR
      ) {
        setIsResetButtonDisabled(true);
        setIsLoading(true);
        await LinkAbhaAPI.linkViaAbhaNumberRequestOtpViaAadhaar({
          ABHANumber: params.ABHANumber!,
        })
          .then(res => {
            setTimer(59);
            setStarted(true);
            navigation.setParams({
              ...params,
              authType: res.data.authType!,
              message: res.data.message,
              token: res.data.tokens?.token!,
              txnId: res.data.txnId,
              phoneNumber: null,
            });
          })
          .catch(errorCatch)
          .finally(() => setIsLoading(false));
      } else if (
        params.linkAbhaOtpRouteSelection ===
        LinkAbhaSelectOtpMethodSelectionEnum.ABHA
      ) {
        setIsResetButtonDisabled(true);
        setIsLoading(true);
        await LinkAbhaAPI.linkViaAbhaNumberRequestOtpViaAbha({
          ABHANumber: params.ABHANumber!,
        })
          .then(res => {
            setTimer(59);
            setStarted(true);
            navigation.setParams({
              ...params,
              authType: res.data.authType!,
              message: res.data.message,
              token: res.data.tokens?.token!,
              txnId: res.data.txnId,
              phoneNumber: null,
            });
          })
          .catch(errorCatch)
          .finally(() => setIsLoading(false));
      }
    } else if (params.linkAbhaMethod === LinkAbhaMethodEnum.ABHA_ADDRESS) {
      if (
        params.linkAbhaOtpRouteSelection ===
        LinkAbhaSelectOtpMethodSelectionEnum.AADHAAR
      ) {
        setIsResetButtonDisabled(true);
        setIsLoading(true);
        await LinkAbhaAPI.linkViaAbhaAddressRequestOtpViaAadhar({
          healthid: params.AbhaAdress!,
        })
          .then(res => {
            setTimer(59);
            setStarted(true);
            navigation.setParams({
              ...params,
              authType: res.data.authType!,
              message: res.data.message,
              token: res.data.tokens?.token!,
              txnId: res.data.txnId,
              phoneNumber: null,
            });
          })
          .catch(errorCatch)
          .finally(() => setIsLoading(false));
      } else if (
        params.linkAbhaOtpRouteSelection ===
        LinkAbhaSelectOtpMethodSelectionEnum.ABHA
      ) {
        setIsResetButtonDisabled(true);
        setIsLoading(true);
        await LinkAbhaAPI.linkViaAbhaAddressRequestOtpViaAbha({
          healthid: params.AbhaAdress!,
        })
          .then(res => {
            setTimer(59);
            setStarted(true);
            navigation.setParams({
              ...params,
              authType: res.data.authType!,
              message: res.data.message,
              token: res.data.tokens?.token!,
              txnId: res.data.txnId,
              phoneNumber: null,
            });
          })
          .catch(errorCatch)
          .finally(() => setIsLoading(false));
      }
    }
  }, [errorCatch, navigation, params]);

  const formatTimer = () => {
    return timer < 10 ? `0${timer}` : timer;
  };

  const fetchAbhaCardFlow = useCallback(
    ({
      token,
      authType,
      aadharNumber,
    }: {
      token: string;
      authType: string;
      aadharNumber: string;
    }) => {
      AbhaCreationAPI.fetchAbhaCard({
        abhaToken: token,
        authType: authType,
        aadharNumber: aadharNumber,
      })
        .then(() => {})
        .catch(() => {});

      AbhaCreationAPI.fetchAbhaCardPdf({
        abhaToken: token,
        authType: authType,
        aadharNumber: aadharNumber,
      })
        .then(() => {})
        .catch(() => {});
    },
    [],
  );

  const sectionDescriptionText = useMemo(() => {
    if (params.linkAbhaMethod === LinkAbhaMethodEnum.PHONE) {
      return `Enter the OTP sent on XXXXXX${params.phoneNumber!.slice(-4)}`;
    } else if (
      params.linkAbhaMethod === LinkAbhaMethodEnum.AADHAAR_NUMBER ||
      params.linkAbhaMethod === LinkAbhaMethodEnum.ABHA_NUMBER
    ) {
      return `Enter the OTP sent on ${
        params?.message?.split(' ')[params?.message?.split(' ')?.length - 1]
      }`;
    } else if (params.linkAbhaMethod === LinkAbhaMethodEnum.ABHA_ADDRESS) {
      if (
        params.linkAbhaOtpRouteSelection ===
        LinkAbhaSelectOtpMethodSelectionEnum.AADHAAR
      ) {
        return 'Enter the OTP sent on registered number linked with Aadhaar';
      } else if (
        params.linkAbhaOtpRouteSelection ===
        LinkAbhaSelectOtpMethodSelectionEnum.ABHA
      ) {
        return 'Enter the OTP sent on registered number linked with ABHA';
      }
    } else {
      return params.message;
    }
  }, [
    params.linkAbhaMethod,
    params.linkAbhaOtpRouteSelection,
    params.message,
    params.phoneNumber,
  ]);

  const onSubmit = useCallback(
    async (values: typeof initialValues) => {
      if (values.otp === '' || values.otp.length !== 6) {
        return;
      }

      const successCallback = (
        response: AxiosResponse<AbhaGenericResponseType>,
      ) => {
        dispatch(
          setSnackBar({
            visible: true,
            message: 'ABHA linked successfully!',
          }),
        );
        fetchAbhaCardFlow({
          token: response.data.tokens?.token || '',
          authType: response.data.authType!,
          aadharNumber: '',
        });
        dispatch(
          setAbhaCardDetails({
            abhaCardImage: response.data.preSignedUrl,
            abhaCardPdfUrl: response.data.preSignedUrl,
            abhaNumber: response.data.ABHANumber,
          }),
        );
        dispatch(loadYatriAllData());
        navigation.popToTop();
        navigation.navigate('Abha');
      };

      if (params.linkAbhaMethod === LinkAbhaMethodEnum.PHONE) {
        setIsLoading(true);
        await LinkAbhaAPI.linkViaPhoneNumberVerifyOtp({
          txnId: params.txnId,
          otp: values.otp,
        })
          .then(async res => {
            // Checking first if OTP entered is correct or not,
            // API doesn't fail it gives response with authResult as failed
            if (res?.data.authResult === 'failed') {
              dispatch(
                setSnackBar({
                  visible: true,
                  message: res?.data?.message,
                }),
              );
              return;
            }
            if (res?.data?.accounts?.length > 1) {
              navigation.navigate('LinkAbhaSelectAbhaAddress', {
                accounts: res.data?.accounts,
                idValue: params.phoneNumber!,
                token: res.data?.token,
                txnId: res.data.txnId,
              });
            } else {
              await LinkAbhaAPI.linkViaPhoneNumberUserVerify({
                txnId: res.data?.txnId,
                abhaToken: res.data?.token,
                ABHANumber: res.data?.accounts?.[0]?.ABHANumber,
              })
                .then(successCallback)
                .catch(errorCatch)
                .finally(() => setIsLoading(false));
            }
          })
          .catch(errorCatch)
          .finally(() => setIsLoading(false));
      } else if (params.linkAbhaMethod === LinkAbhaMethodEnum.AADHAAR_NUMBER) {
        setIsLoading(true);
        await LinkAbhaAPI.linkViaAadhaarNumberVerifyOtp({
          txnId: params.txnId,
          otp: values.otp,
        })
          .then(successCallback)
          .catch(errorCatch)
          .finally(() => setIsLoading(false));
      } else if (params.linkAbhaMethod === LinkAbhaMethodEnum.ABHA_NUMBER) {
        if (
          params.linkAbhaOtpRouteSelection ===
          LinkAbhaSelectOtpMethodSelectionEnum.ABHA
        ) {
          setIsLoading(true);
          await LinkAbhaAPI.linkViaAbhaNumberVerifyOtpViaAbha({
            txnId: params.txnId,
            otp: values.otp,
          })
            .then(successCallback)
            .catch(errorCatch)
            .finally(() => setIsLoading(false));
        } else if (
          params.linkAbhaOtpRouteSelection ===
          LinkAbhaSelectOtpMethodSelectionEnum.AADHAAR
        ) {
          setIsLoading(true);
          await LinkAbhaAPI.linkViaAbhaNumberVerifyOtpViaAadhar({
            txnId: params.txnId,
            otp: values.otp,
          })
            .then(successCallback)
            .catch(errorCatch)
            .finally(() => setIsLoading(false));
        }
      } else if (params.linkAbhaMethod === LinkAbhaMethodEnum.ABHA_ADDRESS) {
        if (
          params.linkAbhaOtpRouteSelection ===
          LinkAbhaSelectOtpMethodSelectionEnum.ABHA
        ) {
          setIsLoading(true);
          await LinkAbhaAPI.linkViaAbhaAddressVerifyOtpViaAbha({
            txnId: params.txnId,
            otp: values.otp,
          })
            .then(successCallback)
            .catch(errorCatch)
            .finally(() => setIsLoading(false));
        } else if (
          params.linkAbhaOtpRouteSelection ===
          LinkAbhaSelectOtpMethodSelectionEnum.AADHAAR
        ) {
          setIsLoading(true);
          await LinkAbhaAPI.linkViaAbhaAdressVerifyOtpViaAadhar({
            txnId: params.txnId,
            otp: values.otp,
          })
            .then(successCallback)
            .catch(errorCatch)
            .finally(() => setIsLoading(false));
        }
      }
    },
    [
      dispatch,
      errorCatch,
      fetchAbhaCardFlow,
      navigation,
      params.linkAbhaMethod,
      params.linkAbhaOtpRouteSelection,
      params.phoneNumber,
      params.txnId,
    ],
  );

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <SafeAreaView style={styles.wrapper}>
        <Formik
          validationSchema={otpValidationScheme}
          initialValues={initialValues}
          onSubmit={onSubmit}>
          {({handleChange, handleSubmit, values, errors, touched}) => (
            <>
              <View style={styles.sectionOne}>
                <Text style={styles.sectionDescription}>
                  {sectionDescriptionText}
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
                    error={!!errors?.otp}
                  />
                  {errors?.otp && touched.otp && (
                    <Text style={styles.errorText}>{errors?.otp}</Text>
                  )}
                  <View style={styles.resendOtp}>
                    <Text>Resend OTP in 00:{formatTimer()}</Text>
                    <ButtonComponent
                      type={ButtonType.TEXT_BUTTON}
                      label="Resend"
                      onPress={startTimer}
                      touchableOpacityProps={{disabled: isResetButtonDisabled}}
                      customButtonStyle={isResetButtonDisabled && styles.faded}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.sectionTwo}>
                <ButtonComponent
                  label="Verify & Link"
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

export default LinkAbhaOtpVerification;

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
