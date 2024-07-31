import {ScrollView, StyleSheet, Text, View} from 'react-native';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import {ButtonType} from '../../enums/buttonType/ButtonType';
import React, {useEffect, useMemo, useState} from 'react';
import {AccountProfile, EyeHiddenPhoneNum} from '../../assets/images/index';
import {List, RadioButton, TextInput} from 'react-native-paper';
import Seprator from '../../components/shared/seprator/Seprator';
import {Formik, FormikProps} from 'formik';
import {DatePickerInput} from 'react-native-paper-dates';
import {neutral, variable} from '../../styles/colors';
import {useAppSelector} from '../../components/shared/hooks/useAppSelector';
import YatriDetailsAPI from '../../services/ApiHelpers/YatriDetailsAPI';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {loadYatriAllData} from '../../services/store/slices/yatriSlice';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {isAxiosError} from 'axios';
import AuthenticationAPI from '../../services/ApiHelpers/AuthenticationAPI';
import {TemplateKeyEnum} from '../../enums/api/authTemplateKeyEnum';
import {durationInDays, formatDate} from '../../utils/Helper';
import {useNavigation} from '@react-navigation/native';
import FullScreenLoader from '../../components/shared/FullScreenLoader';
import {SafeAreaView} from 'react-native-safe-area-context';

const initialValues = {
  dateOfBirth: '',
  gender: '',
  phoneNumber: '',
  email: '',
  tourStartDate: '',
  tourEndDate: '',
  tourDuration: '0',
};

function YatriDetails() {
  const dispatch = useAppDispatch();

  const navigate = useNavigation();

  const [isPhoneNumberHidden, setIsPhoneNumberHidden] = useState<boolean>(true);

  const [isTourismPortalIdHidden, setIsTourismPortalIdHidden] =
    useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [expandedPersonalDetails, setExpandedPersonalDetails] =
    useState<boolean>(true);

  const expandedPersonalDetailsHandlePress = () =>
    setExpandedPersonalDetails(!expandedPersonalDetails);

  const [expandedContactDetails, setExpandedContactDetails] =
    useState<boolean>(true);

  const expandedContactDetailsHandlePress = () =>
    setExpandedContactDetails(!expandedContactDetails);

  const [expandedAddress, setExpandedAddress] = useState<boolean>(true);

  const expandedAddressHandlePress = () => setExpandedAddress(!expandedAddress);

  const [expandedTourDetails, setExpandedTourDetails] = useState<boolean>(true);

  const expandedTourDetailsHandlePress = () =>
    setExpandedTourDetails(!expandedTourDetails);

  const yatriData = useAppSelector(s => s.yatri.yatriAllDetails.data);

  const abhaUserDetails = useAppSelector(
    s => s.yatri.yatriAllDetails.data?.abhaUserDetails,
  );

  const tourismUserDetails = useAppSelector(
    s => s.yatri.yatriAllDetails.data?.tourismUserInfo,
  );

  const registeredNumber = useAppSelector(
    s => s.yatri.yatriAllDetails.data?.phoneNumber || '',
  );

  const emailId =
    abhaUserDetails?.emailId || yatriData?.yatriDetails?.emailId || '';

  const phoneNumber =
    abhaUserDetails?.phoneNumber ||
    tourismUserDetails?.phoneNumber ||
    yatriData?.phoneNumber ||
    '';

  const formikRef = React.useRef<FormikProps<typeof initialValues>>(null);

  const [progressPercentage, setProgressPercentage] = useState(0);

  const formData: any = useMemo(
    () => ({
      yatriDetails: yatriData?.yatriDetails?.fullName,
      register: yatriData?.userName,
      abhaUserDetails: yatriData?.abhaUserDetails,
      idtpDetails: yatriData?.tourismUserInfo,
    }),
    [
      yatriData?.userName,
      yatriData?.yatriDetails?.fullName,
      yatriData?.abhaUserDetails,
      yatriData?.tourismUserInfo,
    ],
  );

  useEffect(() => {
    const dob =
      yatriData?.yatriDetails?.dateOfBirth?.split('/')?.reverse()?.join('-') ||
      '';

    const tourStart = yatriData?.yatriDetails?.tourStartDate
      ? new Date(
          yatriData?.yatriDetails?.tourStartDate
            ?.split('/')
            ?.reverse()
            ?.join('-') || '',
        )
      : new Date();

    const tourEnd = new Date(
      yatriData?.yatriDetails?.tourEndDate
        ? yatriData?.yatriDetails?.tourEndDate?.split('/')?.reverse()?.join('-')
        : '',
    );

    if (tourStart && tourEnd) {
      formikRef.current?.setFieldValue('tourEndDate', tourEnd);
      const tourDuration = durationInDays(tourStart, tourEnd);

      formikRef.current?.setFieldValue('tourDuration', tourDuration);
    }

    formikRef.current?.setFieldValue('gender', yatriData?.yatriDetails?.gender);
    formikRef.current?.setFieldValue('phoneNumber', phoneNumber);
    formikRef.current?.setFieldValue('email', emailId);
    formikRef.current?.setFieldValue('dateOfBirth', dob);
    formikRef.current?.setFieldValue('tourStartDate', tourStart);
  }, [
    emailId,
    phoneNumber,
    yatriData?.yatriDetails,
    abhaUserDetails?.phoneNumber,
    tourismUserDetails?.phoneNumber,
    yatriData?.yatriDetails?.dateOfBirth,
    yatriData?.yatriDetails?.gender,
    yatriData?.yatriDetails?.emailId,
    yatriData?.yatriDetails?.tourEndDate,
    yatriData?.yatriDetails?.tourStartDate,
    yatriData?.yatriDetails?.tourDuration,
  ]);

  useEffect(() => {
    const calculateProgress = () => {
      const percentages: {[key: string]: number} = {
        register: 25,
        yatriDetails: 25,
        abhaUserDetails: 25,
        idtpDetails: 25,
      };
      let totalPercentage: number = 0;
      for (const key in percentages) {
        if (formData?.[key] !== null) {
          totalPercentage += percentages[key];
        }
      }
      setProgressPercentage(totalPercentage);
    };
    calculateProgress(); // Initial calculation
  }, [formData]);

  function updateYatriDetails(values: typeof initialValues) {
    let payload = {
      gender: values.gender,
      emailId: values.email,
      dateOfBirth: values.dateOfBirth ? formatDate(values.dateOfBirth) : '',
      tourStartDate: values.tourStartDate
        ? formatDate(values.tourStartDate)
        : '',
      tourEndDate: values.tourEndDate ? formatDate(values.tourEndDate) : '',
      tourDuration: Number(values.tourDuration),
    };

    if (values.phoneNumber !== phoneNumber) {
      setIsLoading(true);
      AuthenticationAPI.resendOtpForAuth({
        userName: yatriData?.userName ? yatriData?.userName : '',
        phoneNumber: values.phoneNumber,
        templateKey: TemplateKeyEnum.YATRI_PHONE_NUMBER,
      })
        .then(() => {
          navigate.navigate('PhoneNumberUpdateVerification', {
            payload: payload,
          } as [string, {payload: typeof payload}]);
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
    } else {
      setIsLoading(true);
      YatriDetailsAPI.updateYatriDetailsApi({
        phoneNumber: registeredNumber,
        yatriDetails: payload,
      })
        .then(() => {
          dispatch(loadYatriAllData());
          dispatch(
            setSnackBar({
              message: 'Yatri details Updated Successfully',
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
    }
  }

  function calculateTourDuration() {
    const tourStartDate = new Date(
      `${formikRef.current?.values?.tourStartDate}`,
    );
    const tourEndDate = new Date(`${formikRef.current?.values?.tourEndDate}`);
    if (tourStartDate && tourEndDate) {
      const tourDuration = durationInDays(tourStartDate, tourEndDate);
      formikRef.current?.setFieldValue('tourDuration', tourDuration);
    }
  }

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <SafeAreaView style={styles.wrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          automaticallyAdjustKeyboardInsets={true}>
          <View style={styles.profileDetailsView}>
            <View style={styles.profileDetailsViewUp}>
              <AccountProfile style={{marginTop: 26}} />
              <View>
                <Text style={styles.profileDetailsViewUpProfileName}>
                  {yatriData?.yatriDetails?.fullName}
                </Text>
              </View>
              <View style={styles.profileDetailsViewUpProfileCompletedPer}>
                <Text style={styles.profileCompletedPerText}>
                  {progressPercentage}% completed
                </Text>
              </View>
            </View>

            <View style={styles.profileDetailsViewDown}>
              <View style={styles.profileDetailsViewDownUserNameSec}>
                <Text style={styles.leftSideText}>Username</Text>
                <Text style={styles.rightSideText}>{yatriData?.userName}</Text>
              </View>
              <View style={styles.profileDetailsViewDownPhoneNumSec}>
                <Text style={styles.leftSideText}>Phone number</Text>
                <View style={styles.numberHiddenView}>
                  <Text style={styles.rightSideText}>
                    +91 -
                    {isPhoneNumberHidden ? (
                      <>
                        <Text> XXXXXX</Text>
                        {yatriData?.phoneNumber.slice(-4)}
                      </>
                    ) : (
                      yatriData?.phoneNumber
                    )}
                  </Text>
                  <EyeHiddenPhoneNum
                    onPress={() => {
                      setIsPhoneNumberHidden(!isPhoneNumberHidden);
                    }}
                  />
                </View>
              </View>
              <View style={styles.profileDetailsViewDownTourismPortSec}>
                <Text style={styles.leftSideText}>Tourism Portal ID</Text>
                {yatriData?.tourismUserInfo?.idtpId ? (
                  <View style={styles.numberHiddenView}>
                    <Text style={styles.rightSideText}>
                      {isTourismPortalIdHidden ? (
                        <>
                          <Text> XXXXXX</Text>
                          {yatriData?.tourismUserInfo?.idtpId.slice(-4)}
                        </>
                      ) : (
                        yatriData?.tourismUserInfo?.idtpId
                      )}
                    </Text>
                    <EyeHiddenPhoneNum
                      onPress={() => {
                        setIsTourismPortalIdHidden(!isTourismPortalIdHidden);
                      }}
                    />
                  </View>
                ) : (
                  <ButtonComponent
                    label={'ADD ID'}
                    type={ButtonType.TEXT_BUTTON}
                    onPress={() => {}}
                  />
                )}
              </View>
            </View>
          </View>
          <Formik
            initialValues={initialValues}
            innerRef={formikRef}
            onSubmit={(values: typeof initialValues) => {
              updateYatriDetails(values);
            }}>
            {({
              values,
              errors,
              setFieldValue,
              handleChange,
              handleBlur,
              handleSubmit,
              touched,
            }) => (
              <>
                <View style={styles.profileDetailsform}>
                  <List.Accordion
                    expanded={expandedPersonalDetails}
                    onPress={expandedPersonalDetailsHandlePress}
                    title="Personal Details"
                    id="1"
                    titleStyle={styles.accordianTitle}
                    style={styles.accordionList}>
                    <TextInput
                      disabled
                      placeholder="Enter your Full name"
                      style={styles.accordianPersonalDetailsList}
                      label={<Text>Full Name</Text>}
                      value={yatriData?.yatriDetails?.fullName}
                      onBlur={handleBlur('fullName')}
                      onChange={() => {
                        handleChange('fullName');
                      }}
                    />
                    <View style={styles.datePickerView}>
                      <DatePickerInput
                        disabled={!!abhaUserDetails}
                        label="Date of Birth"
                        locale="en"
                        inputMode="start"
                        mode="flat"
                        presentationStyle="pageSheet"
                        withDateFormatInLabel={false}
                        onChange={(date: Date | undefined) => {
                          date?.setDate(date.getDate() + 1);
                          const newDate = date?.toISOString().split('T')[0];
                          newDate && setFieldValue('dateOfBirth', newDate);
                        }}
                        value={
                          values?.dateOfBirth
                            ? new Date(values.dateOfBirth)
                            : undefined
                        }
                        style={styles.datePicker}
                      />
                    </View>
                    <View style={styles.radioView}>
                      <Text style={{paddingLeft: 5}}>Gender</Text>
                      <RadioButton.Group
                        value={values.gender}
                        onValueChange={newVal =>
                          setFieldValue('gender', newVal)
                        }>
                        <View style={styles.allRadioButtons}>
                          <View style={styles.radios}>
                            <RadioButton.Android
                              value="Male"
                              disabled={
                                !!(
                                  abhaUserDetails || tourismUserDetails?.gender
                                )
                              }
                            />
                            <Text>Male</Text>
                          </View>
                          <View style={styles.radios}>
                            <RadioButton.Android
                              value="Female"
                              disabled={
                                !!(
                                  abhaUserDetails || tourismUserDetails?.gender
                                )
                              }
                            />
                            <Text>Female</Text>
                          </View>
                          <View style={styles.radios}>
                            <RadioButton.Android
                              value="Other"
                              disabled={
                                !!(
                                  abhaUserDetails || tourismUserDetails?.gender
                                )
                              }
                            />
                            <Text>other</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                    </View>
                  </List.Accordion>
                  <Seprator />
                  <List.Accordion
                    expanded={expandedContactDetails}
                    onPress={expandedContactDetailsHandlePress}
                    title="Contact Details"
                    id="2"
                    titleStyle={styles.accordianTitle}
                    style={styles.accordionList}>
                    <TextInput
                      disabled={
                        !!(
                          abhaUserDetails?.phoneNumber ||
                          tourismUserDetails?.phoneNumber
                        )
                      }
                      placeholder="Enter your phone number"
                      style={styles.accordianPersonalDetailsList}
                      label="Phone Number"
                      left={<TextInput.Affix text="+91" />}
                      keyboardType="numeric"
                      value={values.phoneNumber}
                    />
                    {errors.phoneNumber && touched.phoneNumber ? (
                      <Text style={styles.errors}>{errors.phoneNumber}</Text>
                    ) : (
                      ''
                    )}
                    <TextInput
                      disabled={!!abhaUserDetails?.emailId}
                      placeholder="Enter your Email addresss"
                      onBlur={handleBlur('email')}
                      onChangeText={handleChange('email')}
                      style={styles.accordianPersonalDetailsList}
                      label="Email Address"
                      value={values.email}
                    />
                  </List.Accordion>
                  <Seprator />
                  <List.Accordion
                    expanded={expandedAddress}
                    onPress={expandedAddressHandlePress}
                    title="Address"
                    id="3"
                    titleStyle={styles.accordianTitle}
                    style={styles.accordionList}>
                    <>
                      <TextInput
                        disabled
                        style={styles.accordianPersonalDetailsList}
                        label={
                          <Text>
                            Address
                            <Text style={styles.asteriskSignStyle}> *</Text>
                          </Text>
                        }
                        placeholder="Enter your Address"
                        value={yatriData?.yatriDetails?.address || ''}
                      />
                      <View style={styles.cityPincodeView}>
                        <View style={styles.cityPinWidthView}>
                          <TextInput
                            disabled
                            placeholder="City/Village"
                            label={
                              <Text>
                                City/Village
                                <Text style={styles.asteriskSignStyle}> *</Text>
                              </Text>
                            }
                            style={styles.textInput}
                            value={yatriData?.yatriDetails?.district || ''}
                          />
                        </View>
                        <View style={styles.cityPinWidthView}>
                          <TextInput
                            disabled
                            placeholder="Pincode"
                            onBlur={handleBlur('pincode')}
                            label={
                              <Text>
                                Pincode
                                <Text style={styles.asteriskSignStyle}> *</Text>
                              </Text>
                            }
                            style={styles.textInput}
                            value={yatriData?.yatriDetails?.pinCode || ''}
                          />
                        </View>
                      </View>
                      <View>
                        <TextInput
                          disabled
                          style={[
                            styles.accordianPersonalDetailsList,
                            styles.stateFix,
                          ]}
                          placeholder="State"
                          label={
                            <Text>
                              State
                              <Text style={styles.asTerix}>*</Text>
                            </Text>
                          }
                          value={yatriData?.yatriDetails?.state || ''}
                        />
                      </View>
                    </>
                  </List.Accordion>
                  <Seprator />
                  <List.Accordion
                    expanded={expandedTourDetails}
                    onPress={expandedTourDetailsHandlePress}
                    title="Tour Details"
                    id="4"
                    titleStyle={styles.accordianTitle}
                    style={styles.accordionList}>
                    <View style={styles.accordionTourList}>
                      <View>
                        <DatePickerInput
                          disabled={!!yatriData?.yatriDetails?.tourStartDate}
                          label="Tour Start Date"
                          locale="en"
                          inputMode="start"
                          mode="flat"
                          presentationStyle="pageSheet"
                          withDateFormatInLabel={false}
                          value={
                            values?.tourStartDate
                              ? new Date(values.tourStartDate || '')
                              : undefined
                          }
                          onChange={(date: Date | undefined) => {
                            date?.setDate(date.getDate() + 1);
                            const newDate = date?.toISOString().split('T')[0];
                            newDate && setFieldValue('tourStartDate', newDate);
                          }}
                          style={styles.inputFieldStyle}
                        />
                        <DatePickerInput
                          disabled={!!yatriData?.yatriDetails?.tourEndDate}
                          label="Tour End Date"
                          locale="en"
                          inputMode="start"
                          mode="flat"
                          presentationStyle="pageSheet"
                          withDateFormatInLabel={false}
                          style={styles.inputFieldStyle}
                          value={
                            values?.tourEndDate
                              ? new Date(values.tourEndDate || '')
                              : undefined
                          }
                          onChange={(date: Date | undefined) => {
                            date?.setDate(date.getDate() + 1);
                            const newDate = date?.toISOString().split('T')[0];
                            newDate &&
                              setFieldValue('tourEndDate', newDate).then(() => {
                                calculateTourDuration();
                              });
                          }}
                        />
                        <TextInput
                          disabled
                          style={styles.inputFieldStyle}
                          placeholder="Tour Duration"
                          mode="flat"
                          value={values.tourDuration + ' ' + 'days'}
                        />
                      </View>
                    </View>
                  </List.Accordion>
                  <Seprator />
                </View>
                <View>
                  <ButtonComponent
                    label="Update"
                    onPress={() => {
                      handleSubmit();
                    }}
                  />
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

export default YatriDetails;

const styles = StyleSheet.create({
  flexItem: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: variable.whiteBackground,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  profileDetailsView: {
    borderWidth: 1,
    borderColor: '#33189F0D',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 36,
    backgroundColor:
      'linear-gradient(149.96deg, rgba(51, 24, 159, 0.08) 18.27%, rgba(51, 24, 159, 0.008) 81.63%)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 36,
  },
  profileDetailsViewUp: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  numberHiddenView: {
    flexDirection: 'row',
    gap: 10,
  },
  profileDetailsViewUpProfileName: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 18.75,
    textAlign: 'left',
    color: '#17272F',
  },
  profileDetailsViewUpProfileCompletedPer: {
    borderRadius: 12,
    backgroundColor: '#337D3814',
  },
  profileCompletedPerText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14.06,
    textAlign: 'left',
    color: '#337D38',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  profileDetailsViewDown: {
    gap: 18,
  },
  profileDetailsViewDownUserNameSec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  datePickerView: {
    paddingHorizontal: 20,
  },
  datePicker: {
    backgroundColor: neutral.white,
  },
  leftSideText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16.41,
    textAlign: 'left',
    color: '#202020',
  },
  errors: {
    color: variable.danger,
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingBottom: 10,
    paddingLeft: 25,
  },
  rightSideText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16.41,
    textAlign: 'left',
    color: '#202020',
  },
  profileDetailsViewDownPhoneNumSec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  profileDetailsViewDownTourismPortSec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 16,
  },
  profileDetailsform: {
    backgroundColor: variable.whiteBackground,
  },
  accordianTitle: {
    color: variable.primary,
    fontSize: 16,
    lineHeight: 18.7,
    fontWeight: '500',
    textAlign: 'left',
  },
  accordianContent: {
    marginTop: 20,
    flex: 1,
  },
  accordionList: {
    paddingLeft: 12,
    backgroundColor: variable.whiteBackground,
  },
  accordianPersonalDetailsList: {
    backgroundColor: variable.whiteBackground,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  radioView: {
    paddingTop: 20,
    paddingLeft: 30,
    marginBottom: 15,
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
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'white',
  },
  cityPinWidthView: {
    width: '45%',
    // alignSelf: 'baseline',
  },
  asTerix: {
    color: variable.danger,
    fontSize: 16,
  },
  textInput: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
  stateFix: {
    width: '40%',
  },
  accordionTourList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 11,
    paddingHorizontal: 20,
    flexWrap: 'wrap',
  },
  asteriskSignStyle: {
    color: variable.danger,
    fontSize: 16,
  },
  inputFieldStyle: {
    backgroundColor: variable.whiteBackground,
    color: variable.blackTextColor,
  },
});
