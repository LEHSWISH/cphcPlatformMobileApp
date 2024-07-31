import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Checkbox} from 'react-native-paper';
import {Formik} from 'formik';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UnAuthenticatedStackParamList} from '../../navigation/stack/UnAuthenticatedStack';
import {NHMandUKGovtLogoImage} from '../../assets/images';
import {signupValidationSchema} from '../../validations/signup/signupValidation';
import AuthenticationAPI from '../../services/ApiHelpers/AuthenticationAPI';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {TemplateKeyEnum} from '../../enums/api/authTemplateKeyEnum';
import {useTranslation} from 'react-i18next';
import {variable} from '../../styles/colors';
import {
  PRIVACY_POILICY,
  TERMS_AND_CONDITION,
} from '../../utils/constants/Constant';
import {Colors} from '../../styles';

type SignUpProps = NativeStackScreenProps<
  UnAuthenticatedStackParamList,
  'Signup'
>;

const initialValues = {
  userName: '',
  phoneNumber: '',
  password: '',
  licenseAgreement: true,
};

const Signup = ({navigation}: SignUpProps) => {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [validateUsernameError, setValidateUsernameError] = useState('');
  const [checked, setChecked] = React.useState(false);

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Function to verify the username
  function verifyUsername(username: string) {
    if (!username) {
      return;
    }
    AuthenticationAPI.verifyUserNameOnSignup(username)
      .then(() => {
        setValidateUsernameError('');
      })
      .catch(error => {
        setValidateUsernameError(error?.data?.message);
      });
  }

  // Function to send the otp to phone number
  function SendOtp(values: typeof initialValues) {
    // hit otp api here and then navigate it to otp screen
    if (!validateUsernameError) {
      if (checked) {
        return AuthenticationAPI.sendOtpForSignup({
          ...values,
          templateKey: TemplateKeyEnum.SIGN_UP,
        })
          .then(() => {
            dispatch(
              setSnackBar({
                message: 'Otp send successfully',
                visible: true,
              }),
            );
            navigation.navigate('SendOtp', {
              userName: values.userName,
              phoneNumber: values.phoneNumber,
              password: values.password,
              isNavigate: true,
              screenTitle: 'OTP Verification',
              navigationToScreen: 'Login',
              submitButtonName: 'Verify & Continue',
              snackbarMessage: 'Signed up successfully!',
              backButtonName: 'Back to Sign Up',
              templateKey: 'sign-up',
            });
          })
          .catch(error => {
            if (error?.data?.message) {
              dispatch(
                setSnackBar({
                  message: error?.data?.message,
                  visible: true,
                }),
              );
            } else {
              dispatch(
                setSnackBar({
                  message: t('common_error_messages.something_went_wrong'),
                  visible: true,
                }),
              );
            }
          });
      } else {
        dispatch(
          setSnackBar({
            message: 'Please accept Terms and Conditions ',
            visible: true,
          }),
        );
      }
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <Formik
        validationSchema={signupValidationSchema}
        initialValues={initialValues}
        onSubmit={SendOtp}>
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          setFieldTouched,
          touched,
        }) => (
          <ScrollView
            contentContainerStyle={styles.scrollView}
            automaticallyAdjustKeyboardInsets={true}>
            <NHMandUKGovtLogoImage style={styles.sectionOneImage} />
            <Text style={[styles.alignCenter, styles.welcomeText]}>
              Let`s get started
            </Text>
            <View style={styles.sectionTwo}>
              <TextInput
                style={styles.inputFieldStyle}
                label={
                  <Text>
                    Create Username
                    <Text style={styles.asteriskSignStyle}> *</Text>
                  </Text>
                }
                mode="flat"
                placeholder="E.g. johndoe0783"
                value={values.userName}
                onChangeText={handleChange('userName')}
                onBlur={() => {
                  verifyUsername(values?.userName);
                }}
                onEndEditing={() => setFieldTouched('userName')}
              />
              {errors?.userName ? (
                <Text style={styles.errorText}>{errors?.userName}</Text>
              ) : (
                validateUsernameError && (
                  <Text style={styles.errorText}>{validateUsernameError}</Text>
                )
              )}
              <TextInput
                style={styles.inputFieldStyle}
                label={
                  <Text>
                    Phone Number
                    <Text style={styles.asteriskSignStyle}> *</Text>
                  </Text>
                }
                mode="flat"
                placeholder="Enter you phone number"
                value={values.phoneNumber}
                onChangeText={handleChange('phoneNumber')}
                left={<TextInput.Affix text="+91" />}
              />
              {errors?.phoneNumber && touched.phoneNumber && (
                <Text style={styles.errorText}>{errors?.phoneNumber}</Text>
              )}
              <TextInput
                style={styles.inputFieldStyle}
                label={
                  <Text>
                    Password
                    <Text style={styles.asteriskSignStyle}> *</Text>
                  </Text>
                }
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={toggleShowPassword}
                  />
                }
                mode="flat"
                placeholder="Create Password"
                value={values.password}
                onChangeText={handleChange('password')}
              />
              {errors?.password && touched.password && (
                <Text style={styles.errorText}>{errors?.password}</Text>
              )}
              <View style={styles.termsAndConditionField}>
                <Checkbox.Android
                  color="#33189F"
                  status={checked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked(!checked);
                  }}
                />
                <Text style={styles.termsAndConditionText}>
                  {'I agree to the '}
                  <Text
                    style={styles.textButton}
                    onPress={async () => {
                      // dev environment url need to change
                      const url = TERMS_AND_CONDITION;
                      const termsandcondition = await Linking.canOpenURL(url);

                      if (termsandcondition) {
                        await Linking.openURL(url);
                      } else {
                        dispatch(
                          setSnackBar({
                            message: t(
                              'common_error_messages.something_went_wrong',
                            ),
                            visible: true,
                          }),
                        );
                      }
                    }}>
                    Terms & Conditions
                  </Text>
                  {' and '}
                  <Text
                    style={styles.textButton}
                    onPress={async () => {
                      // dev environment url need to change
                      const url = PRIVACY_POILICY;
                      const privacyPolicy = await Linking.canOpenURL(url);

                      if (privacyPolicy) {
                        await Linking.openURL(url);
                      } else {
                        dispatch(
                          setSnackBar({
                            message: t(
                              'common_error_messages.something_went_wrong',
                            ),
                            visible: true,
                          }),
                        );
                      }
                    }}>
                    {' Privacy policy'}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  handleSubmit();
                }}>
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
              <View style={styles.alreadyHaveAccountView}>
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.replace('Login')}>
                  <Text style={styles.textButton}>&nbsp;Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: variable.whiteBackground,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    gap: 25,
  },
  sectionOneImage: {alignSelf: 'center'},
  sectionTwo: {
    flexGrow: 1,
    width: '100%',
    maxWidth: '100%',
  },
  alignCenter: {
    textAlign: 'center',
  },
  inputFieldStyle: {
    backgroundColor: '#fff',
    color: Colors.variable.blackTextColor,
    margin: 12,
  },
  asteriskSignStyle: {
    color: Colors.variable.danger,
    fontSize: 16,
  },
  welcomeText: {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: '600',
    color: Colors.variable.blackTextColor,
  },
  textButton: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'left',
    color: Colors.variable.primary,
    textDecorationLine: 'underline',
  },
  continueButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.variable.primary,
    borderRadius: 10,
    margin: 35,
    marginTop: 'auto',
    paddingHorizontal: 28,
  },
  continueButtonText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
    padding: 10,
  },
  errorText: {
    color: Colors.variable.danger,
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 10,
    paddingLeft: 25,
  },
  termsAndConditionField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '80%',
    marginVertical: 18,
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  termsAndConditionText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  alreadyHaveAccountView: {flexDirection: 'row', justifyContent: 'center'},
});

export default Signup;
