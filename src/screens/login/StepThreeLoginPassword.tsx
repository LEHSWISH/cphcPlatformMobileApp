import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UnAuthenticatedStackParamList} from '../../navigation/stack/UnAuthenticatedStack';
import {Formik} from 'formik';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import {variable} from '../../styles/colors';
import {TextInput} from 'react-native-paper';
import LoginBadge from '../../components/core/loginBadge/LoginBadge';
import {passwordValidationScheme} from '../../validations/login/loginValidation';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {loginYatri} from '../../services/store/slices/authSlice';
import {ButtonType} from '../../enums/buttonType/ButtonType';

type StepThreeLoginPasswordProps = NativeStackScreenProps<
  UnAuthenticatedStackParamList,
  'StepThreeLoginPassword'
>;
const initialValues = {password: ''};
let width = Dimensions.get('window').width;
const StepThreeLoginPassword = ({
  navigation,
  route,
}: StepThreeLoginPasswordProps) => {
  const dispatch = useAppDispatch();

  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  async function onLogin(values: typeof initialValues) {
    let selection = route?.params?.userName;
    const payload: {userName: string; password: string} = {
      userName: selection,
      password: values.password,
    };
    dispatch(loginYatri(payload));
  }
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.sectionOne}>
          <LoginBadge
            type="Username"
            data={route?.params?.userName}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <View style={styles.sectionTwo}>
          <>
            <Formik
              validationSchema={passwordValidationScheme}
              initialValues={initialValues}
              onSubmit={onLogin}>
              {({handleChange, handleSubmit, values, errors, touched}) => (
                <>
                  <TextInput
                    style={{
                      backgroundColor: '#fff',
                      color: '#202020',
                      margin: 12,
                    }}
                    label={
                      <Text>
                        Password
                        <Text style={{color: '#C7413A', fontSize: 16}}> *</Text>
                      </Text>
                    }
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={toggleShowPassword}
                      />
                    }
                    secureTextEntry={!showPassword}
                    mode="flat"
                    placeholder="Enter password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                  />
                  {errors?.password && touched.password && (
                    <Text style={styles.errorText}>{errors?.password}</Text>
                  )}
                  <ButtonComponent
                    label="Forgot Password"
                    type={ButtonType.TEXT_BUTTON}
                    onPress={() => {
                      navigation.popToTop();
                      navigation.replace('ForgotPassword');
                    }}
                  />
                  <ButtonComponent
                    label="Login"
                    onPress={() => {
                      handleSubmit();
                    }}
                  />
                </>
              )}
            </Formik>
          </>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StepThreeLoginPassword;

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
    flex: 0.2,
    justifyContent: 'center',
  },
  sectionTwo: {
    flex: 0.8,
  },
  alignCenter: {
    textAlign: 'center',
  },
  formContainer: {
    height: '100%',
    flex: 1,
  },
  errorText: {
    color: '#C7413A',
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 10,
    paddingLeft: 25,
  },
});
