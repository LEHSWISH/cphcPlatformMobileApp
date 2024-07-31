import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFormik} from 'formik';
import {Checkbox, TextInput} from 'react-native-paper';
import {isAxiosError} from 'axios';
import * as Yup from 'yup';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import RecoverAbhaAPI from '../../services/ApiHelpers/RecoverAbhaAPI';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {neutral, variable} from '../../styles/colors';
import {Colors} from '../../styles';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';

export const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required('Phone number is a required field')
    .length(10, 'Please enter a valid Phone number')
    .matches(/^[6-9]/, 'Please enter a valid Phone number'),
  consent: Yup.bool().oneOf([true], 'Please provide your consent'),
});

const initialValues = {
  phoneNumber: '',
  consent: false,
};

type RecoverAbhaPropType = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'RecoverAbha'
>;
const RecoverAbha = ({navigation}: RecoverAbhaPropType) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    onSubmit: values => {
      if (isLoading) {
        return;
      }
      setIsLoading(true);
      RecoverAbhaAPI.generateMobileOtpApi({
        mobile: values.phoneNumber,
        consent: values.consent,
      })
        .then(response => {
          navigation.navigate('RecoverAbhaOtpVerification', {
            txnId: response.data.txnId,
            message: response?.data.message,
            phoneNumber: values.phoneNumber,
          });
        })
        .catch(err => {
          let message = 'Something went wrong, Please try again';
          if (isAxiosError(err) && err.response?.data?.errorDetails) {
            const errorDetails = JSON.parse(err.response?.data?.errorDetails);
            message = errorDetails.error.message;
          } else if (isAxiosError(err) && err.response?.data?.message) {
            message = err.response?.data?.message;
          }
          dispatch(
            setSnackBar({
              visible: true,
              message,
            }),
          );
        })
        .finally(() => setIsLoading(false));
    },
    validationSchema,
  });

  const onChangeText = useCallback(
    (field: string) => (value: string | boolean) =>
      formik.setFieldValue(field, value),
    [formik],
  );

  return (
    <SafeAreaView style={styles.flexItem}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.description}>
          Enter your phone number which you have provided for communication
          regarding ABHA
        </Text>
        <View style={styles.flexItem}>
          <View>
            <TextInput
              style={styles.textInputStyle}
              label={
                <Text>
                  Phone number
                  <Text style={styles.asterisk}> *</Text>
                </Text>
              }
              mode="flat"
              error={formik.touched.phoneNumber && !!formik.errors?.phoneNumber}
              maxLength={10}
              onEndEditing={() => formik.setFieldTouched('phoneNumber')}
              keyboardType="numeric"
              placeholder="Enter your phone number"
              value={formik.values.phoneNumber}
              onChangeText={onChangeText('phoneNumber')}
            />
            <Text style={styles.errorText}>
              {formik.touched.phoneNumber && formik.errors?.phoneNumber}
            </Text>
          </View>

          <View style={styles.consentContainer}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={formik.values.consent ? 'checked' : 'unchecked'}
              onPress={() => {
                formik.setFieldValue('consent', !formik.values.consent, true);
              }}
            />
            <Text>I agree to the</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AadharTermsAndCondition', {
                  acceptTermsAndCondition: () => formik.setFieldValue('consent', true, true),
                });
              }}>
              <Text style={styles.textButton}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
          {formik.touched.consent && formik.errors?.consent && (
            <Text style={styles.errorText}>
              {formik.touched.consent && formik.errors?.consent}
            </Text>
          )}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => formik.handleSubmit()}>
            <Text style={styles.continueButtonText}>Get OTP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecoverAbha;

const styles = StyleSheet.create({
  flexItem: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: neutral.white,
    paddingVertical: 50,
    paddingHorizontal: 20,
    gap: 20,
  },
  textInputStyle: {
    backgroundColor: '#fff',
    color: '#202020',
    margin: 12,
    marginTop: 10,
  },
  asterisk: {color: variable.danger, fontSize: 16},
  description: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: variable.blackTextColor,
    textAlign: 'center',
  },
  consentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 'auto',
  },
  continueButton: {
    backgroundColor: variable.primary,
    borderRadius: 8,
    margin: 35,
    paddingHorizontal: 58,
    paddingVertical: 8,
  },
  continueButtonText: {
    fontFamily: 'Roboto',
    color: neutral.white,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    color: variable.danger,
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
});
