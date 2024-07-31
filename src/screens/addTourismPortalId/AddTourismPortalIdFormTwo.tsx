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
import {TextInput, RadioButton} from 'react-native-paper';
import {List} from 'react-native-paper';
import {DatePickerInput} from 'react-native-paper-dates';
import {Formik, FormikProps} from 'formik';
import {addTourismPortalIdValidationSchema} from '../../validations/createAbha/CreateAbhaViaTourismId';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {useAppSelector} from '../../components/shared/hooks/useAppSelector';
import CreateAbhaApi from '../../services/ApiHelpers/CreateAbhaApi';
import {isAxiosError} from 'axios';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import YatriDetailsAPI from '../../services/ApiHelpers/YatriDetailsAPI';
import {variable} from '../../styles/colors';
import {durationInDays} from '../../utils/Helper';
import Seprator from '../../components/shared/seprator/Seprator';

type AddTourismPortalIdFormTwoPropType = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'AddTourismPortalIdFormTwo'
>;

const initialValues = {
  fullName: '',
  dateOfBirth: '',
  gender: 'Male',
  phoneNumber: '',
  emailAddress: '',
  address: '',
  pincode: '',
  district: '',
  state: '',
  tourStartDate: '',
  tourEndDate: '',
  tourDuration: '',
};

function OpenTourismPortalIdFormToo({
  route,
  navigation,
}: AddTourismPortalIdFormTwoPropType) {
  const yatriDetails = useAppSelector(
    s => s.yatri.yatriAllDetails.data?.yatriDetails,
  );
  const isDataLoadedFromResponseRef = useRef(false);
  const formikRef = useRef<FormikProps<typeof initialValues>>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const {fullName, gender, address, phoneNumber, dateOfBirth, emailId} =
    route.params.response;

  const idtpId = useAppSelector(
    s => s.yatri.yatriAllDetails.data?.tourismUserInfo?.idtpId,
  );

  useEffect(() => {
    if (!isDataLoadedFromResponseRef.current) {
      isDataLoadedFromResponseRef.current = true;
      const date1 = new Date(
        yatriDetails?.tourStartDate
          ? yatriDetails?.tourStartDate?.split('/')?.reverse()?.join('-')
          : '',
      );

      const date2 = new Date(
        yatriDetails?.tourEndDate
          ? yatriDetails?.tourEndDate?.split('/')?.reverse()?.join('-')
          : '',
      );
      let newDate = '';

      if (date1 && date2) {
        newDate = durationInDays(date1, date2).toString();
      }

      formikRef.current?.setValues({
        ...initialValues,
        fullName: fullName,
        gender: gender,
        dateOfBirth:
          yatriDetails?.dateOfBirth.split('/').reverse().join('-') ||
          dateOfBirth ||
          '',
        tourStartDate:
          yatriDetails?.tourStartDate?.split('/')?.reverse()?.join('-') || '',
        tourEndDate:
          yatriDetails?.tourEndDate?.split('/')?.reverse()?.join('-') || '',

        tourDuration: yatriDetails?.tourDuration.toString() || newDate,

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

  const setTourStartAndEndDate = () => {
    const tourStartDate = new Date(
      `${formikRef.current?.values?.tourStartDate}`,
    );

    const tourEndDate = new Date(`${formikRef.current?.values?.tourEndDate}`);

    if (tourStartDate && tourEndDate) {
      const data = durationInDays(tourStartDate, tourEndDate);

      formikRef.current?.setFieldValue('tourDuration', data.toString());
    }
  };
  return (
    <KeyboardAvoidingView style={styles.flexItem}>
      <SafeAreaView style={styles.wrapper}>
        <View>
          <Text style={[styles.alignCenter, styles.tourismIdDescription]}>
            Tourism Portal ID -
            <Text style={{color: variable.primary}}>
              XXXXXX{idtpId?.slice(-2)}
            </Text>
          </Text>
        </View>
        <Formik
          validationSchema={addTourismPortalIdValidationSchema}
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
                emailId: val.emailAddress,
                gender: val.gender,
                tourStartDate: val.tourStartDate
                  ?.split('-')
                  ?.reverse()
                  ?.join('/'),
                tourEndDate: val.tourEndDate?.split('-')?.reverse()?.join('/'),
                tourDuration: parseInt(val.tourDuration, 10) || 0,
                address: val.address,
                pinCode: val.pincode,
                state: val.state,
                district: val.district,
              },
            })
              .then(() => {
                navigation.popToTop();
                let message = 'Updated Successfully';
                dispatch(
                  setSnackBar({
                    visible: true,
                    message,
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
                          style={{backgroundColor: variable.whiteBackground}}
                          withDateFormatInLabel={false}
                          onChange={(date: Date | undefined) => {
                            date?.setDate(date.getDate() + 1);
                            const newDate = date?.toISOString().split('T')[0];
                            newDate && setFieldValue('dateOfBirth', newDate);
                          }}
                          value={
                            values.dateOfBirth
                              ? new Date(values.dateOfBirth)
                              : undefined
                          }
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
                        placeholder="Enter your Email"
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
                        placeholder="Enter your Address"
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
                            placeholder="City"
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
                          {errors.district && touched.district ? (
                            <Text style={styles.errors}>{errors.district}</Text>
                          ) : (
                            <Text> </Text>
                          )}
                        </View>
                        <View style={styles.cityPinWidthView}>
                          <TextInput
                            placeholder="Pincode"
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
                        placeholder="State"
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
                    <List.Accordion
                      titleStyle={styles.accordianTitle}
                      title="Tour Details"
                      id="4"
                      style={styles.accordionList}>
                      <View style={styles.tourDetailsView}>
                        <DatePickerInput
                          locale="en"
                          placeholder="MM/DD/YY"
                          inputMode="start"
                          presentationStyle="pageSheet"
                          style={styles.datePicker}
                          withDateFormatInLabel={false}
                          onChange={(date: Date | undefined) => {
                            date?.setDate(date.getDate() + 1);
                            const newTourStartDate = date
                              ?.toISOString()
                              .split('T')[0];
                            newTourStartDate &&
                              setFieldValue(
                                'tourStartDate',
                                newTourStartDate,
                              ).then(() => {
                                setTourStartAndEndDate();
                              });
                          }}
                          value={
                            values.tourStartDate
                              ? new Date(values.tourStartDate)
                              : undefined
                          }
                          onBlur={handleBlur('tourStartDate')}
                          label={
                            <Text>
                              Tour Start Date
                              <Text style={styles.asTerix}>*</Text>
                            </Text>
                          }
                        />
                        {errors?.tourStartDate && touched?.tourStartDate ? (
                          <Text style={styles.errors}>
                            {errors.tourStartDate}
                          </Text>
                        ) : (
                          ''
                        )}
                        <DatePickerInput
                          locale="en"
                          placeholder="MM/DD/YY"
                          inputMode="start"
                          mode="flat"
                          presentationStyle="pageSheet"
                          style={styles.datePicker}
                          withDateFormatInLabel={false}
                          onChange={(date: Date | undefined) => {
                            date?.setDate(date.getDate() + 1);
                            const newTourEndDate = date
                              ?.toISOString()
                              .split('T')[0];
                            newTourEndDate &&
                              setFieldValue('tourEndDate', newTourEndDate).then(
                                () => {
                                  setTourStartAndEndDate();
                                },
                              );
                          }}
                          value={
                            values.tourEndDate
                              ? new Date(values.tourEndDate)
                              : undefined
                          }
                          onBlur={handleBlur('dateOfBirth')}
                          label={
                            <Text>
                              Tour End Date
                              <Text style={styles.asTerix}>*</Text>
                            </Text>
                          }
                        />
                        {errors?.tourEndDate && touched?.tourEndDate ? (
                          <Text style={styles.errors}>
                            {errors.tourEndDate}
                          </Text>
                        ) : (
                          ''
                        )}
                        <TextInput
                          disabled
                          placeholder="Tour Duration"
                          style={styles.datePicker}
                          value={values.tourDuration + ' ' + 'Days'}
                          label={
                            <Text>
                              Tour Duration
                              <Text style={styles.asTerix}>*</Text>
                            </Text>
                          }
                        />
                      </View>
                    </List.Accordion>
                    <Seprator />
                  </List.AccordionGroup>
                </ScrollView>
              </View>
              <View style={{margin: 'auto'}}>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() => {
                    handleSubmit();
                  }}>
                  <Text style={styles.continueButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default OpenTourismPortalIdFormToo;

const styles = StyleSheet.create({
  flexItem: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: variable.whiteBackground,
  },
  alignCenter: {
    textAlign: 'center',
  },
  tourismIdDescription: {
    fontFamily: 'Roboto',
    fontSize: 16,
    marginHorizontal: 80,
    marginTop: 50,
    fontWeight: '500',
    color: variable.blackTextColor,
    backgroundColor: variable.primaryWithLightShade,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
    backgroundColor: variable.whiteBackground,
  },
  accordianPersonalDetailsList: {
    backgroundColor: variable.whiteBackground,
    marginHorizontal: 20,
    marginBottom: 18,
  },
  accordianContactDetailsList: {
    backgroundColor: variable.whiteBackground,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  accordianListDatePicker: {
    backgroundColor: variable.whiteBackground,
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
    backgroundColor: variable.whiteBackground,
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
    color: variable.whiteBackground,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: variable.whiteBackground,
    marginBottom: 10,
  },
  tourDetailsView: {
    paddingHorizontal: 20,
  },
  datePicker: {
    backgroundColor: variable.whiteBackground,
    marginBottom: 8,
  },
});
