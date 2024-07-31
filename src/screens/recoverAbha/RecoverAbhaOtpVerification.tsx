import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../styles';
import {Formik} from 'formik';
import {TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AxiosResponse, isAxiosError} from 'axios';
import * as Yup from 'yup';
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
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {AbhaGenericResponseType} from '../../interfaces/apiResponseTypes/AbhaGenericResponseType';
import RecoverAbhaAPI from '../../services/ApiHelpers/RecoverAbhaAPI';

export const otpValidationScheme = Yup.object().shape({
  otp: Yup.string().required('Please enter your OTP'),
});

const initialValues = {otp: ''};

export interface RecoverAbhaOtpVerificationParamsPropType {
  txnId: string;
  message: string;
  phoneNumber: string | null;
}

type RecoverAbhaOtpVerificationPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'RecoverAbhaOtpVerification'
>;

const RecoverAbhaOtpVerification = ({
  navigation,
  route,
}: RecoverAbhaOtpVerificationPropTypes) => {
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
    setIsResetButtonDisabled(true);
    setIsLoading(true);
    await RecoverAbhaAPI.generateMobileOtpApi({
      mobile: params.phoneNumber!,
      consent: true,
    })
      .then(response => {
        setTimer(59);
        setStarted(true);
        navigation.setParams({
          ...params,
          message: response.data.message,
          txnId: response.data.txnId,
        });
      })
      .catch(errorCatch)
      .finally(() => {
        setIsLoading(false);
      });
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

      setIsLoading(true);
      await RecoverAbhaAPI.verifyMobileOtp({
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
            navigation.navigate('RecoverAbhaSelectAbhaAddress', {
              accounts: res.data?.accounts,
              idValue: params.phoneNumber!,
              token: res.data?.token,
              txnId: res.data.txnId,
            });
          } else {
            await RecoverAbhaAPI.verifyUser({
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
    },
    [
      dispatch,
      errorCatch,
      fetchAbhaCardFlow,
      navigation,
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
                  {`Enter the OTP sent on XXXXXX${params.phoneNumber!.slice(
                    -4,
                  )}`}
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
                  label="Recover"
                  onPress={() => {
                    handleSubmit();
                  }}
                />
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </>
  );
};

export default RecoverAbhaOtpVerification;

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
  faded: {
    opacity: 0.4,
  },
});
