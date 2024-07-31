import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {usernameOrPhonenumberValidationSchema} from '../../validations/login/loginValidation';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UnAuthenticatedStackParamList} from '../../navigation/stack/UnAuthenticatedStack';
import {variable} from '../../styles/colors';
import AppText from '../../components/shared/text/AppText';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import AuthenticationAPI from '../../services/ApiHelpers/AuthenticationAPI';
import {decryption} from '../../utils/Helper';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {ButtonType} from '../../enums/buttonType/ButtonType';
import {NHMandUKGovtLogoImage} from '../../assets/images';

type LoginProps = NativeStackScreenProps<
  UnAuthenticatedStackParamList,
  'Login'
>;

let width = Dimensions.get('window').width;
const initialValues = {userNameOrPhoneNumber: ''};

const Login = ({navigation}: LoginProps) => {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  function onGetUsers(values: typeof initialValues) {
    const inputValue = values.userNameOrPhoneNumber;
    if (/^[0-9]+$/.test(inputValue)) {
      if (isLoading) {
        return;
      }
      setIsLoading(true);
      const decryptedUserNames: string[] = [];
      AuthenticationAPI.getAllUserLinkedWithPhoneNumber(inputValue)
        .then(res => {
          res.data.users.forEach(username => {
            decryptedUserNames.push(decryption(username).toString().trim());
          });
          res.data.users = decryptedUserNames;
          if (res.data.linkedWith === 1) {
            navigation.navigate('StepThreeLoginPassword', {
              userName: res.data.users[0],
            });
          } else if (res.data.linkedWith === 0) {
            dispatch(
              setSnackBar({
                message: 'No username is linked with this phone number',
                visible: true,
              }),
            );
          } else {
            navigation.navigate('StepTwoLogin', {
              phoneNumber: inputValue,
              previousStepResponse: res.data,
            });
          }
        })
        .catch(() => {
          dispatch(
            setSnackBar({
              message: 'No username is linked with this phone number',
              visible: true,
            }),
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      navigation.navigate('StepThreeLoginPassword', {
        userName: inputValue,
      });
    }
  }
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.sectionOne}>
          <NHMandUKGovtLogoImage style={styles.sectionOneImage} />
          <AppText customStyles={styles.loginText}> Log In</AppText>
        </View>
        <View style={styles.sectionTwo}>
          <>
            <Formik
              validationSchema={usernameOrPhonenumberValidationSchema}
              initialValues={initialValues}
              onSubmit={onGetUsers}>
              {({handleChange, handleSubmit, values, errors, touched}) => (
                <View>
                  <TextInput
                    style={styles.inputFieldStyle}
                    label={
                      <Text>
                        Username or Phone number
                        <Text style={styles.asteriskSignStyle}> *</Text>
                      </Text>
                    }
                    mode="flat"
                    placeholder="Enter your username or phone number"
                    value={values.userNameOrPhoneNumber}
                    onChangeText={handleChange('userNameOrPhoneNumber')}
                  />
                  {errors?.userNameOrPhoneNumber &&
                    touched?.userNameOrPhoneNumber && (
                      <Text style={styles.errorText}>
                        {errors?.userNameOrPhoneNumber}
                      </Text>
                    )}

                  <ButtonComponent
                    label={t('common_action_text.continue')}
                    onPress={() => {
                      handleSubmit();
                    }}
                  />
                  <View style={styles.signUpContainer}>
                    <Text>Don't have an account?</Text>
                    <ButtonComponent
                      label="Sign Up"
                      type={ButtonType.TEXT_BUTTON}
                      onPress={() => {
                        navigation.replace('Signup');
                      }}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: variable.whiteBackground,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    width: width,
  },
  sectionOne: {
    flex: 0.3,
    justifyContent: 'center',
  },
  sectionOneImage: {alignSelf: 'center'},
  loginText: {
    fontSize: 32,
    fontWeight: '600',
    color: variable.blackTextColor,
    textAlign: 'center',
    alignItems: 'center',
    marginVertical: 25,
  },
  sectionTwo: {
    flex: 0.7,
  },
  alignCenter: {
    textAlign: 'center',
  },
  formContainer: {
    height: '100%',
    flex: 1,
  },
  logInText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '700',
    color: '#6C6969',
  },
  welcomeText: {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: '600',
    color: '#202020',
  },
  textButton: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'left',
    color: '#33189F',
    textDecorationLine: 'underline',
    marginHorizontal: 20,
  },
  continueButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#33189F',
    borderRadius: 8,
    margin: 35,
    paddingHorizontal: 58,
    paddingVertical: 8,
  },
  continueButtonText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    color: '#C7413A',
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 10,
    paddingLeft: 25,
  },
  inputFieldStyle: {
    backgroundColor: '#fff',
    color: '#202020',
    margin: 12,
  },
  asteriskSignStyle: {
    color: '#C7413A',
    fontSize: 16,
  },
  signUpContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default Login;
