import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../styles';
import {Formik} from 'formik';
import {Checkbox, TextInput} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {t} from 'i18next';
import AbhaCreationAPI from '../../services/ApiHelpers/AbhaCreationAPI';
import {encryption} from '../../utils/Helper';
import {isAxiosError} from 'axios';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {aadharNumberValidationSchema} from '../../validations/createAbhaViaAadhaar/AbhaViaAadhaarValidation';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import {ButtonType} from '../../enums/buttonType/ButtonType';
import FullScreenLoader from '../../components/shared/FullScreenLoader';

type EnterAadharPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'EnterAadhar'
>;

const EnterAadhar = ({navigation}: EnterAadharPropTypes) => {
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  return (
    <>
      {isLoading && <FullScreenLoader />}
      <SafeAreaView style={styles.wrapper}>
        <Formik
          validationSchema={aadharNumberValidationSchema}
          initialValues={{aadharNumber: ''}}
          onSubmit={values => {
            const inputValue = values.aadharNumber;
            if (
              /^\d+$/.test(inputValue) &&
              inputValue.length === 12 &&
              inputValue !== ''
            ) {
              if (checked) {
                // api call here
                const encryptedAadharNumber = encryption(inputValue).toString();
                setIsLoading(true);
                AbhaCreationAPI.AbhaCreationGenerateAaadhaarOtpApi({
                  aadhaar: encryptedAadharNumber,
                  consent: checked,
                })
                  .then(response => {
                    navigation.navigate('AadharAuthentication', {
                      txnId: response?.data?.txnId,
                      aadhaarCardNumber: inputValue,
                      response: response?.data,
                    });
                  })
                  .catch(error => {
                    let message = t(
                      'common_error_messages.something_went_wrong',
                    );
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
              } else {
                dispatch(
                  setSnackBar({
                    message: 'Please accept Terms and Conditions ',
                    visible: true,
                  }),
                );
              }
            } else {
              dispatch(
                setSnackBar({
                  message: t('abhaViaAadhaar.enter_valid_aadhaar_number'),
                  visible: true,
                }),
              );
            }
          }}>
          {({handleChange, handleSubmit, values, errors, touched}) => (
            <KeyboardAvoidingView style={styles.keyboardAvoidingStyling}>
              <View style={styles.sectionOne}>
                <Text style={styles.stepsStyle}>Step 1 of 3</Text>
                <Text style={styles.sectionDescription}>
                  Aadhaar verification allows you to start using your ABHA
                  instantly
                </Text>
                <View>
                  <TextInput
                    style={styles.formInputStyle}
                    label={
                      <Text>
                        Aadhaar number
                        <Text style={styles.asteriskStyle}> *</Text>
                      </Text>
                    }
                    mode="flat"
                    placeholder="Enter your unique aadhar number"
                    value={values.aadharNumber}
                    onChangeText={handleChange('aadharNumber')}
                    keyboardType="numeric"
                    error={errors?.aadharNumber ? true : false}
                  />
                  {errors?.aadharNumber && touched.aadharNumber ? (
                    <Text style={styles.errorText}>{errors?.aadharNumber}</Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.sectionTwo}>
                <View style={styles.linkAbha}>
                  <Checkbox.Android
                    color={Colors.primary.brand}
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked(!checked);
                    }}
                  />
                  <Text>I agree to the</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('AadharTermsAndCondition', {
                        acceptTermsAndCondition: setChecked,
                      });
                    }}>
                    <Text style={styles.textButton}>Terms & Conditions</Text>
                  </TouchableOpacity>
                </View>
                <ButtonComponent
                  label="Get OTP"
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
            </KeyboardAvoidingView>
          )}
        </Formik>
      </SafeAreaView>
    </>
  );
};

export default EnterAadhar;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  keyboardAvoidingStyling: {
    flex: 1,
  },
  sectionOne: {
    flexGrow: 0.75,
  },
  sectionTwo: {
    flexGrow: 0.25,
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
  textButton: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'left',
    color: Colors.primary.brand,
    textDecorationLine: 'underline',
    marginHorizontal: 8,
  },
  linkAbha: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
