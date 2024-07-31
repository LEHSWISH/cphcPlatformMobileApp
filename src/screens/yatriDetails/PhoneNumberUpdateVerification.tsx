import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import {ButtonType} from '../../enums/buttonType/ButtonType';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import YatriDetailsAPI from '../../services/ApiHelpers/YatriDetailsAPI';
import {TemplateKeyEnum} from '../../enums/api/authTemplateKeyEnum';
import {loadYatriAllData} from '../../services/store/slices/yatriSlice';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {isAxiosError} from 'axios';
import * as Yup from 'yup';
import FullScreenLoader from '../../components/shared/FullScreenLoader';
import {variable} from '../../styles/colors';
import {useAppSelector} from '../../components/shared/hooks/useAppSelector';
import AuthenticationAPI from '../../services/ApiHelpers/AuthenticationAPI';

type PhoneNumberUpdateVerificationPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'PhoneNumberUpdateVerification'
>;
const PhoneNumberUpdateVerification = ({
  route,
}: PhoneNumberUpdateVerificationPropTypes) => {
  const [isResetButtonDisabled, setIsResetButtonDisabled] = useState(true);

  const validationSchema = Yup.object({
    otp: Yup.string()
      .required('Please enter the OTP to continue')
      .length(6, 'Please enter a valid OTP'),
  });

  const [timer, setTimer] = useState(59);
  const [started, setStarted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const yatriData = useAppSelector(s => s.yatri.yatriAllDetails.data);

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
    AuthenticationAPI.resendOtpForAuth({
      userName: yatriData?.userName ? yatriData?.userName : '',
      phoneNumber: route?.params?.payload?.phoneNumber,
      templateKey: TemplateKeyEnum.YATRI_PHONE_NUMBER,
    })
      .then(() => {
        dispatch(
          setSnackBar({
            message: 'OTP sent successfully',
            visible: true,
          }),
        );
      })
      .catch(err => {
        let message = 'Something went wrong, Please try again';
        if (isAxiosError(err) && err.response?.data?.message) {
          message = err.response?.data?.message;
        }
        dispatch(
          setSnackBar({
            message,
            visible: true,
          }),
        );
      });
  };

  const formatTimer = () => {
    return timer < 10 ? `0${timer}` : timer;
  };

  const phoneNumber = route?.params?.payload?.phoneNumber
    ? route?.params?.payload?.phoneNumber.slice(-4)
    : 'XXXX';
  return (
    <SafeAreaView style={styles.wrapper}>
      <Formik
        validationSchema={validationSchema}
        initialValues={{otp: ''}}
        onSubmit={values => {
          setIsLoading(true);
          YatriDetailsAPI.updateYatriDetailsApi({
            phoneNumber,
            otp: values.otp,
            templateKey: TemplateKeyEnum.YATRI_PHONE_NUMBER,
            yatriDetails: {
              phoneNumber: route?.params?.payload?.phoneNumber,
              dateOfBirth: route?.params?.payload?.dateOfBirth,
              emailId: route?.params?.payload?.emailId,
              gender: route?.params?.payload?.gender,
              tourStartDate: route?.params?.payload?.tourStartDate,
              tourEndDate: route?.params?.payload?.tourEndDate,
              tourDuration: route?.params?.payload?.tourDuration,
            },
          })
            .then(() => {
              dispatch(loadYatriAllData());
              dispatch(
                setSnackBar({
                  message: 'Yatri details updated successfully',
                  visible: true,
                }),
              );
            })
            .catch(err => {
              let message = 'Something went wrong, Please try again';
              if (isAxiosError(err) && err.response?.data?.message) {
                message = err.response?.data?.message;
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
            {isLoading && <FullScreenLoader />}
            <View style={styles.sectionOne}>
              <Text style={styles.sectionDescription}>
                Enter the OTP sent on XXXXXX{phoneNumber} to update your contact
                details.
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
                  onChangeText={handleChange('abhaCommunicationOtp')}
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
                      startTimer();
                    }}
                    touchableOpacityProps={{disabled: isResetButtonDisabled}}
                    customButtonStyle={isResetButtonDisabled && styles.faded}
                  />
                </View>
              </View>
            </View>
            <View style={styles.sectionTwo}>
              <ButtonComponent
                label="Verify & Update"
                onPress={() => {
                  handleSubmit();
                }}
              />
            </View>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default PhoneNumberUpdateVerification;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: variable.whiteBackground,
  },
  sectionOne: {
    flexGrow: 0.9,
  },
  sectionTwo: {
    flexGrow: 0.1,
  },
  stepsStyle: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    color: variable.descriptionText,
    paddingTop: 35,
  },
  sectionDescription: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    color: variable.primary,
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  sectionDescriptionTwo: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    color: variable.primary,
    paddingHorizontal: 15,
    paddingVertical: 40,
  },
  formInputStyle: {
    backgroundColor: variable.whiteBackground,
    color: variable.blackTextColor,
    margin: 12,
  },
  asteriskStyle: {
    color: variable.danger,
    fontSize: 16,
  },
  errorText: {
    color: variable.danger,
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
