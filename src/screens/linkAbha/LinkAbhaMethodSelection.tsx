import React, {useCallback, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import {RadioButton, TextInput} from 'react-native-paper';
import {useFormik} from 'formik';
import {isAxiosError} from 'axios';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../styles';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import LinkAbhaAPI from '../../services/ApiHelpers/LinkAbhaAPI';
import LinkAbhaContinueButtonContainer from './LinkAbhaContinueButtonContainer';
import {validationSchemaLinkAbhaMethodSelection} from '../../validations/linkAbhaValidations';
import {encryption} from '../../utils/Helper';
import ButtonComponent from '../../components/shared/button/ButtonComponent';

export enum LinkAbhaMethodEnum {
  PHONE = 'phone',
  ABHA_ADDRESS = 'abhaAddress',
  ABHA_NUMBER = 'abhaNumber',
  AADHAAR_NUMBER = 'aadhaarNumber',
}

const initialValues = {
  selectedMethod: LinkAbhaMethodEnum.PHONE,
  [LinkAbhaMethodEnum.PHONE]: '',
  [LinkAbhaMethodEnum.ABHA_NUMBER]: '',
  [LinkAbhaMethodEnum.ABHA_ADDRESS]: '',
  [LinkAbhaMethodEnum.AADHAAR_NUMBER]: '',
};

type LinkAbhaMethodSelectionPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'LinkAbhaMethodSelection'
>;

const LinkAbhaMethodSelection = ({
  navigation,
}: LinkAbhaMethodSelectionPropTypes) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    onSubmit: async values => {
      if (isLoading) {
        return;
      }
      if (values.selectedMethod === LinkAbhaMethodEnum.PHONE) {
        setIsLoading(true);
        await LinkAbhaAPI.linkViaPhoneNumberSendOtp({
          mobile: values[LinkAbhaMethodEnum.PHONE],
        })
          .then(response => {
            navigation.navigate('LinkAbhaOtpVerification', {
              linkAbhaMethod: LinkAbhaMethodEnum.PHONE,
              linkAbhaOtpRouteSelection: null,
              ABHANumber: response.data.ABHANumber,
              authType: response.data.authType!,
              message: response.data.message,
              phoneNumber: values[LinkAbhaMethodEnum.PHONE],
              token: response.data.tokens?.token!,
              txnId: response.data.txnId,
              aadhaarNumber: null,
              AbhaAdress: null,
            });
          })
          .catch(err => {
            let message = 'Something went wrong, Please try again';
            if (isAxiosError(err) && err.response?.data?.errorDetails) {
              try {
                const errorDetails = JSON.parse(
                  err.response?.data?.errorDetails,
                );
                message = errorDetails.error.message;
              } catch (_error) {}
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
      } else if (
        values.selectedMethod === LinkAbhaMethodEnum.ABHA_NUMBER ||
        values.selectedMethod === LinkAbhaMethodEnum.ABHA_ADDRESS
      ) {
        navigation.navigate('LinkAbhaSelectOtpMethod', {
          linkAbhaMethod: values.selectedMethod,
          description:
            'Validate your ABHA using OTP on phone number linked with',
          idLabel:
            values.selectedMethod === LinkAbhaMethodEnum.ABHA_NUMBER
              ? 'ABHA number'
              : 'ABHA address',
          idValue: values[values.selectedMethod],
        });
      } else if (values.selectedMethod === LinkAbhaMethodEnum.AADHAAR_NUMBER) {
        setIsLoading(true);
        const encryptedAadharNumber = encryption(
          values[LinkAbhaMethodEnum.AADHAAR_NUMBER],
        ).toString();
        await LinkAbhaAPI.linkViaAadhaarNumberRequestOtp({
          aadhaar: encryptedAadharNumber,
        })
          .then(response => {
            navigation.navigate('LinkAbhaOtpVerification', {
              linkAbhaMethod: LinkAbhaMethodEnum.AADHAAR_NUMBER,
              linkAbhaOtpRouteSelection: null,
              ABHANumber: response.data.ABHANumber,
              authType: response.data.authType!,
              message: response.data.message,
              phoneNumber: null,
              token: response.data.tokens?.token!,
              txnId: response.data.txnId,
              aadhaarNumber: values[LinkAbhaMethodEnum.AADHAAR_NUMBER],
              AbhaAdress: null,
            });
          })
          .catch(err => {
            let message = 'Something went wrong, Please try again';
            if (isAxiosError(err) && err.response?.data?.errorDetails) {
              try {
                const errorDetails = JSON.parse(
                  err.response?.data?.errorDetails,
                );
                message = errorDetails.error.message;
              } catch (_error) {}
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
      }
    },
    initialValues,
    validationSchema: validationSchemaLinkAbhaMethodSelection,
  });

  const onChangeText = useCallback(
    (field: string) => (value: string) => formik.setFieldValue(field, value),
    [formik],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.containerStyle}
      automaticallyAdjustKeyboardInsets={true}>
      <Text style={styles.description}>
        You can link your ABHA (Ayushman Bharat Health Account) using ABHA, ABHA
        number or ABHA address
      </Text>
      <View style={styles.radioGroup}>
        <RadioButton.Group
          onValueChange={newValue => {
            formik.resetForm();
            formik.setFieldValue(
              'selectedMethod',
              newValue as LinkAbhaMethodEnum,
            );
          }}
          value={formik.values.selectedMethod}>
          <View style={styles.radioGroup}>
            <View style={styles.radioGroupChild}>
              <View style={styles.radioButtonItem}>
                <RadioButton.Android value={LinkAbhaMethodEnum.PHONE} />
                <Text style={styles.radioLabel}>Phone number</Text>
              </View>
              <View style={styles.radioButtonItem}>
                <RadioButton.Android value={LinkAbhaMethodEnum.ABHA_ADDRESS} />
                <Text style={styles.radioLabel}>ABHA address</Text>
              </View>
            </View>
            <View style={styles.radioGroupChild}>
              <View style={styles.radioButtonItem}>
                <RadioButton.Android value={LinkAbhaMethodEnum.ABHA_NUMBER} />
                <Text style={styles.radioLabel}>ABHA number</Text>
              </View>
              <View style={styles.radioButtonItem}>
                <RadioButton.Android
                  value={LinkAbhaMethodEnum.AADHAAR_NUMBER}
                />
                <Text style={styles.radioLabel}>Aadhaar number</Text>
              </View>
            </View>
          </View>
        </RadioButton.Group>
      </View>
      <KeyboardAvoidingView style={styles.fieldAreaContainer}>
        {formik.values.selectedMethod === LinkAbhaMethodEnum.PHONE ? (
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
              error={
                formik.touched[LinkAbhaMethodEnum.PHONE] &&
                !!formik.errors?.[LinkAbhaMethodEnum.PHONE]
              }
              maxLength={10}
              onEndEditing={() =>
                formik.setFieldTouched(LinkAbhaMethodEnum.PHONE)
              }
              keyboardType="numeric"
              placeholder="Enter your phone number"
              value={formik.values[LinkAbhaMethodEnum.PHONE]}
              onChangeText={onChangeText(LinkAbhaMethodEnum.PHONE)}
            />
            <Text style={styles.errorText}>
              {formik.touched[LinkAbhaMethodEnum.PHONE] &&
                formik.errors?.[LinkAbhaMethodEnum.PHONE]}
            </Text>
          </View>
        ) : formik.values.selectedMethod === LinkAbhaMethodEnum.ABHA_NUMBER ? (
          <View>
            <TextInput
              style={styles.textInputStyle}
              label={
                <Text>
                  ABHA number
                  <Text style={styles.asterisk}> *</Text>
                </Text>
              }
              mode="flat"
              maxLength={17}
              keyboardType="numbers-and-punctuation"
              placeholder="Enter your ABHA number"
              value={formik.values[LinkAbhaMethodEnum.ABHA_NUMBER]}
              onChangeText={onChangeText(LinkAbhaMethodEnum.ABHA_NUMBER)}
              onEndEditing={() =>
                formik.setFieldTouched(LinkAbhaMethodEnum.ABHA_NUMBER)
              }
              error={
                formik.touched[LinkAbhaMethodEnum.ABHA_NUMBER] &&
                !!formik.errors?.[LinkAbhaMethodEnum.ABHA_NUMBER]
              }
            />
            <Text style={styles.errorText}>
              {formik.touched[LinkAbhaMethodEnum.ABHA_NUMBER] &&
                formik.errors?.[LinkAbhaMethodEnum.ABHA_NUMBER]}
            </Text>
          </View>
        ) : formik.values.selectedMethod === LinkAbhaMethodEnum.ABHA_ADDRESS ? (
          <View>
            <TextInput
              style={styles.textInputStyle}
              label={
                <Text>
                  ABHA address
                  <Text style={styles.asterisk}> *</Text>
                </Text>
              }
              mode="flat"
              maxLength={13}
              placeholder="Enter your ABHA address"
              value={formik.values[LinkAbhaMethodEnum.ABHA_ADDRESS]}
              onChangeText={onChangeText(LinkAbhaMethodEnum.ABHA_ADDRESS)}
              onEndEditing={() =>
                formik.setFieldTouched(LinkAbhaMethodEnum.ABHA_ADDRESS)
              }
              error={
                formik.touched[LinkAbhaMethodEnum.ABHA_ADDRESS] &&
                !!formik.errors?.[LinkAbhaMethodEnum.ABHA_ADDRESS]
              }
            />
            <Text style={styles.errorText}>
              {formik.touched[LinkAbhaMethodEnum.ABHA_ADDRESS] &&
                formik.errors?.[LinkAbhaMethodEnum.ABHA_ADDRESS]}
            </Text>
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.textInputStyle}
              label={
                <Text>
                  Aadhaar number
                  <Text style={styles.asterisk}> *</Text>
                </Text>
              }
              mode="flat"
              maxLength={12}
              keyboardType="numeric"
              placeholder="Enter your Aadhaar number"
              value={formik.values[LinkAbhaMethodEnum.AADHAAR_NUMBER]}
              onChangeText={onChangeText(LinkAbhaMethodEnum.AADHAAR_NUMBER)}
              onEndEditing={() =>
                formik.setFieldTouched(LinkAbhaMethodEnum.AADHAAR_NUMBER)
              }
              error={
                formik.touched[LinkAbhaMethodEnum.AADHAAR_NUMBER] &&
                !!formik.errors?.[LinkAbhaMethodEnum.AADHAAR_NUMBER]
              }
            />
            <Text style={styles.errorText}>
              {formik.touched[LinkAbhaMethodEnum.AADHAAR_NUMBER] &&
                formik.errors?.[LinkAbhaMethodEnum.AADHAAR_NUMBER]}
            </Text>
          </View>
        )}
        <ButtonComponent
          label="Forgot ABHA number?"
          onPress={() => navigation.navigate('RecoverAbha')}
          type="text-button"
        />
      </KeyboardAvoidingView>
      <LinkAbhaContinueButtonContainer onPress={formik.handleSubmit} />
    </ScrollView>
  );
};

export default LinkAbhaMethodSelection;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: Colors.neutral.white,
    flex: 1,
    padding: 20,
    flexDirection: 'column',
  },
  description: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    color: Colors.variable.blackTextColor,
    paddingVertical: 14,
  },
  radioGroup: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: 10,
  },
  radioGroupChild: {
    flexGrow: 0.5,
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.variable.descriptionText,
  },
  fieldAreaContainer: {
    flexGrow: 1,
  },
  textInputStyle: {
    backgroundColor: '#fff',
    color: '#202020',
    margin: 12,
    marginTop: 10,
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
});
