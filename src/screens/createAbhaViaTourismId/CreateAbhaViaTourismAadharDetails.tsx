import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInput, RadioButton, Checkbox} from 'react-native-paper';
import {List} from 'react-native-paper';
import Seprator from '../../components/shared/seprator/Seprator';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import {ButtonType} from '../../enums/buttonType/ButtonType';
import {DatePickerInput} from 'react-native-paper-dates';
import {Formik, FormikProps} from 'formik';
import {aadhaarDetailsValidationSchema} from '../../validations/createAbha/CreateAbhaViaTourismId';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {useAppSelector} from '../../components/shared/hooks/useAppSelector';
import CreateAbhaApi from '../../services/ApiHelpers/CreateAbhaApi';
import {convertAadharCardNumber} from '../../utils/Helper';
import {isAxiosError} from 'axios';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import YatriDetailsAPI from '../../services/ApiHelpers/YatriDetailsAPI';
import {neutral, variable} from '../../styles/colors';

type CreateViaTourismIdAadharDetailsPropType = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'CreateAbhaByTourismPortalIDFormTwo'
>;

const initialValues = {
  aadhaarNumber: '',
  fullName: '',
  dateOfBirth: '',
  gender: 'Male',
  phoneNumber: '',
  emailAddress: '',
  address: '',
  pincode: '',
  district: '',
  state: '',
};

const CreateViaTourismIdAadharDetails = ({
  route,
}: CreateViaTourismIdAadharDetailsPropType) => {
  const yatriDetails = useAppSelector(
    s => s.yatri.yatriAllDetails.data?.yatriDetails,
  );
  const isDataLoadedFromResponseRef = useRef(false);
  const formikRef = useRef<FormikProps<typeof initialValues>>(null);
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitButtonErrorText, setSubmitButtonErrorText] =
    useState<String>('');
  const dispatch = useAppDispatch();
  const {
    fullName,
    aadhaarNo,
    gender,
    address,
    phoneNumber,
    dateOfBirth,
    emailId,
  } = route.params.response;

  useEffect(() => {
    if (!isDataLoadedFromResponseRef.current) {
      isDataLoadedFromResponseRef.current = true;
      formikRef.current?.setValues({
        ...initialValues,
        fullName: fullName,
        gender: gender,
        aadhaarNumber: aadhaarNo || '',
        dateOfBirth:
          yatriDetails?.dateOfBirth.split('/').reverse().join('-') ||
          dateOfBirth ||
          '',
        phoneNumber: phoneNumber.slice(-10) || '',
        emailAddress: emailId || '',
        address: address || '',
        pincode: yatriDetails?.pinCode || '',
      });
      if (yatriDetails?.pinCode && yatriDetails.pinCode.length === 6) {
        validatePincode(yatriDetails.pinCode);
      }
    }
  }, [
    aadhaarNo,
    emailId,
    fullName,
    gender,
    phoneNumber,
    address,
    dateOfBirth,
    yatriDetails,
  ]);

  const handleOnChangeNumericField = (name: string) => {
    return (val: string) => {
      const lengthAllowed =
        name === 'aadhaarNumber' ? 12 : name === 'phoneNumber' ? 10 : 6;
      const newValue = val.replace(/[^\d]/g, '').slice(0, lengthAllowed);
      formikRef.current?.setFieldValue(name, newValue, true);

      if (name === 'pincode' && newValue.length === 6) {
        validatePincode(newValue);
      }
    };
  };

  const validatePincode = (newValue: string) => {
    setIsLoading(true);
    CreateAbhaApi.getPostalPinCodeInfo(newValue)
      .then(res => {
        if (res.data.state) {
          formikRef.current?.setFieldValue('state', res.data.state || '');
          formikRef.current?.setFieldValue('district', res.data.district || '');
        } else {
          formikRef.current?.setFieldValue('state', '');
          formikRef.current?.setFieldValue('distinct', '');
        }
      })
      .catch(() => {
        formikRef.current?.setFieldValue('state', '');
        formikRef.current?.setFieldValue('distinct', '');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.flexItem}>
      <SafeAreaView style={styles.wrapper}>
        <View>
          <Text style={[styles.alignCenter, styles.tourismIdDescription]}>
            Almost there! To complete your ABHA process, please fill out the
            details.
          </Text>
        </View>
        <Formik
          validationSchema={aadhaarDetailsValidationSchema}
          initialValues={initialValues}
          innerRef={formikRef}
          onSubmit={async val => {
            if (isLoading) {
              return;
            }
            setIsLoading(true);
            return YatriDetailsAPI.updateYatriDetailsApi({
              phoneNumber: val.phoneNumber,
              yatriDetails: {
                fullName: val.fullName,
                address: val.address,
                pinCode: val.pincode,
                state: val.state,
                gender: val.gender,
                emailId: val.emailAddress,
                district: val.district,
                dateOfBirth: val.dateOfBirth.split('-')?.reverse()?.join('/'),
              },
            })
              .then(async () => {
                const encryptedAadaarCardNumber = convertAadharCardNumber(
                  val?.aadhaarNumber,
                ).toString();
                return CreateAbhaApi.generateAbhaByDemograpicAPI({
                  aadharNumber: encryptedAadaarCardNumber,
                  dateOfBirth: val.dateOfBirth
                    ?.split('-')
                    ?.reverse()
                    ?.join('-'),
                  gender: val.gender.slice(0, 1),
                  stateCode: val.state,
                  districtCode: val.district,
                  name: val.fullName,
                  mobileNumber: val.phoneNumber,
                  consent: checked,
                })
                  .then(() => {
                    // console.log('response', res);
                  })
                  .catch(err => {
                    let message = 'Something went wrong, Please try again';
                    if (isAxiosError(err) && err.response?.data?.errorDetails) {
                      try {
                        const errorDetails = JSON.parse(
                          err.response?.data?.errorDetails,
                        );
                        if (errorDetails?.code === 'HIS-422') {
                          message =
                            'Aadhaar Number does not match with the user. Please enter correct details.';
                          setSubmitButtonErrorText(message);
                          return;
                        }
                      } catch (error) {
                        //
                      }
                    }
                    if (isAxiosError(err) && err.response?.data?.message) {
                      message = err.response?.data?.message;
                    }
                    dispatch(
                      setSnackBar({
                        visible: true,
                        message,
                      }),
                    );
                  });
              })
              .catch(err => {
                let message = 'Something went wrong, Please try again';
                if (isAxiosError(err) && err.response?.data?.message) {
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
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <>
              <View style={styles.accordianContent}>
                <ScrollView>
                  <List.AccordionGroup>
                    <List.Accordion
                      titleStyle={styles.accordianTitle}
                      title="Personal details"
                      id="1"
                      style={styles.accordionList}>
                      <TextInput
                        disabled
                        style={styles.accordianPersonalDetailsList}
                        placeholder="John Doe"
                        onChangeText={handleChange('fullName')}
                        value={values.fullName}
                        onBlur={handleBlur('fullName')}
                        label={
                          <Text>
                            Full Name
                            <Text style={styles.asTerix}>*</Text>
                          </Text>
                        }
                      />
                      {errors?.fullName && touched?.fullName ? (
                        <Text style={styles.errors}>{errors.fullName}</Text>
                      ) : (
                        ''
                      )}
                      <View style={styles.accordianListDatePicker}>
                        <DatePickerInput
                          disabled={
                            !!(dateOfBirth || yatriDetails?.dateOfBirth)
                          }
                          locale="en"
                          inputMode="start"
                          mode="flat"
                          presentationStyle="pageSheet"
                          style={{backgroundColor: 'white'}}
                          withDateFormatInLabel={false}
                          onChange={(date: Date | undefined) => {
                            const newDate = date?.toISOString().split('T')[0];
                            newDate && setFieldValue('dateOfBirth', newDate);
                          }}
                          value={new Date(values.dateOfBirth || '')}
                          onBlur={handleBlur('dateOfBirth')}
                          label={
                            <Text>
                              Date of Birth
                              <Text style={styles.asTerix}>*</Text>
                            </Text>
                          }
                        />
                        {errors?.dateOfBirth && touched?.dateOfBirth ? (
                          <Text style={styles.errors}>
                            {`${errors?.dateOfBirth}`}
                          </Text>
                        ) : (
                          ''
                        )}
                      </View>
                      <View style={styles.radioView}>
                        <Text style={{paddingLeft: 10}}>
                          Gender
                          <Text style={styles.asTerix}>*</Text>
                        </Text>
                        <RadioButton.Group
                          onValueChange={newVal => {
                            setFieldValue('gender', newVal);
                          }}
                          value={values.gender}>
                          <View style={styles.allRadioButtons}>
                            <View style={styles.radios}>
                              <RadioButton value="Male" disabled />
                              <Text>Male</Text>
                            </View>
                            <View style={styles.radios}>
                              <RadioButton value="Female" disabled />
                              <Text>Female</Text>
                            </View>
                            <View style={styles.radios}>
                              <RadioButton value="Other" disabled />
                              <Text>other</Text>
                            </View>
                          </View>
                        </RadioButton.Group>
                      </View>
                      <TextInput
                        style={styles.accordianPersonalDetailsList}
                        onChangeText={handleOnChangeNumericField(
                          'aadhaarNumber',
                        )}
                        value={values.aadhaarNumber || ''}
                        onBlur={handleBlur('aadhaarNumber')}
                        label={
                          <Text>
                            Aadhaar Number
                            <Text style={styles.asTerix}>*</Text>
                          </Text>
                        }
                      />
                      {errors.aadhaarNumber && touched.aadhaarNumber ? (
                        <Text style={styles.errors}>
                          {errors.aadhaarNumber}
                        </Text>
                      ) : (
                        ''
                      )}
                    </List.Accordion>
                    <Seprator />
                    <List.Accordion
                      titleStyle={styles.accordianTitle}
                      title="Contact details"
                      id="2"
                      style={styles.accordionList}>
                      <TextInput
                        disabled
                        style={styles.accordianContactDetailsList}
                        onChangeText={handleOnChangeNumericField('phoneNumber')}
                        value={values.phoneNumber}
                        onBlur={handleBlur('phoneNumber')}
                        label={
                          <Text>
                            Phone number
                            <Text style={styles.asTerix}>*</Text>
                          </Text>
                        }
                        left={<TextInput.Affix text="+91" />}
                      />
                      {errors.phoneNumber && touched.phoneNumber ? (
                        <Text style={styles.errors}>{errors.phoneNumber}</Text>
                      ) : (
                        ''
                      )}
                      <TextInput
                        style={styles.accordianContactDetailsList}
                        onChangeText={handleChange('emailAddress')}
                        onBlur={handleBlur('emailAddress')}
                        value={values.emailAddress}
                        label={<Text>Email address</Text>}
                      />
                      {errors.emailAddress && touched.emailAddress ? (
                        <Text style={styles.errors}>{errors.emailAddress}</Text>
                      ) : (
                        ''
                      )}
                    </List.Accordion>
                    <Seprator />
                    <List.Accordion
                      titleStyle={styles.accordianTitle}
                      title="Address"
                      id="3"
                      style={styles.accordionList}>
                      <TextInput
                        disabled={!!address}
                        style={styles.accordianContactDetailsList}
                        onChangeText={handleChange('address')}
                        placeholder="-------------------"
                        onBlur={handleBlur('address')}
                        value={values.address}
                        label={
                          <Text>
                            Address
                            <Text style={styles.asTerix}>*</Text>
                          </Text>
                        }
                      />
                      {errors.address && touched.address ? (
                        <Text style={styles.errors}>{errors.address}</Text>
                      ) : (
                        ''
                      )}
                      <View style={styles.cityPincodeView}>
                        <View style={styles.cityPinWidthView}>
                          <TextInput
                            disabled
                            placeholder="East Delhi"
                            onChangeText={handleChange('district')}
                            onBlur={handleBlur('district')}
                            value={values.district}
                            label={
                              <Text>
                                City/district
                                <Text style={styles.asTerix}>*</Text>
                              </Text>
                            }
                            style={styles.textInput}
                          />
                          {errors.emailAddress && touched.emailAddress ? (
                            <Text style={styles.errors}>{errors.district}</Text>
                          ) : (
                            <Text> </Text>
                          )}
                        </View>
                        <View style={styles.cityPinWidthView}>
                          <TextInput
                            placeholder="------------"
                            onChangeText={handleOnChangeNumericField('pincode')}
                            onBlur={handleBlur('pincode')}
                            value={values.pincode}
                            label={
                              <Text>
                                Pincode
                                <Text style={styles.asTerix}>*</Text>
                              </Text>
                            }
                            style={styles.textInput}
                          />
                          {errors.pincode && touched.pincode ? (
                            <Text style={styles.errors}>{errors.pincode}</Text>
                          ) : (
                            <Text> </Text>
                          )}
                        </View>
                      </View>
                      <TextInput
                        disabled
                        placeholder="Delhi"
                        onChangeText={handleChange('state')}
                        value={values.state}
                        style={styles.accordianContactDetailsList}
                        label={
                          <Text>
                            State
                            <Text style={styles.asTerix}>*</Text>
                          </Text>
                        }
                      />
                    </List.Accordion>
                    <Seprator />
                  </List.AccordionGroup>
                </ScrollView>
              </View>
              <View style={{margin: 'auto'}}>
                <View style={styles.agreeView}>
                  <Checkbox.Android
                    onPress={() => setChecked(!checked)}
                    status={checked ? 'checked' : 'unchecked'}
                  />
                  <Text style={styles.agreeText}>
                    I agree to the
                    <ButtonComponent
                      label={'Terms & conditions'}
                      onPress={() => {}}
                      type={ButtonType.TEXT_BUTTON}
                    />
                  </Text>
                </View>
                <Text style={styles.errors}>{submitButtonErrorText}</Text>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() => {
                    handleSubmit();
                  }}>
                  <Text style={styles.continueButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CreateViaTourismIdAadharDetails;

const styles = StyleSheet.create({
  flexItem: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: neutral.white,
  },
  alignCenter: {
    textAlign: 'center',
  },
  tourismIdDescription: {
    fontFamily: 'Roboto',
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 50,
    fontWeight: '500',
    color: variable.blackTextColor,
  },
  errors: {
    color: variable.danger,
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingBottom: 10,
    paddingLeft: 25,
  },
  asTerix: {
    color: variable.danger,
    fontSize: 16,
  },
  accordianContent: {
    marginTop: 20,
    flex: 1,
  },
  accordianTitle: {
    color: variable.primary,
    fontSize: 16,
    lineHeight: 18.7,
    fontWeight: '500',
    textAlign: 'left',
  },
  accordionList: {
    paddingLeft: 12,
    backgroundColor: neutral.white,
  },
  accordianPersonalDetailsList: {
    backgroundColor: neutral.white,
    marginHorizontal: 20,
    marginBottom: 18,
  },
  accordianContactDetailsList: {
    backgroundColor: neutral.white,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  accordianListDatePicker: {
    backgroundColor: neutral.white,
    marginHorizontal: 20,
  },
  radioView: {
    paddingVertical: 15,
    paddingLeft: 30,
    gap: 7,
  },
  allRadioButtons: {
    flexDirection: 'row',
    gap: 7,
  },
  radios: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityPincodeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10,
    backgroundColor: neutral.white,
  },
  cityPinWidthView: {
    width: '45%',
  },
  agreeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agreeText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 14,
    textAlign: 'center',
  },
  termsAndConText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  continueButton: {
    backgroundColor: variable.primary,
    borderRadius: 8,
    marginTop: 20,
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
  textInput: {
    backgroundColor: neutral.white,
    marginBottom: 10,
  },
});
