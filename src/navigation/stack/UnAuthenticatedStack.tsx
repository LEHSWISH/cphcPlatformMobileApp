import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {IOtpScreenParamsTypes} from '../../interfaces/sendOtpScreen/IOtpScreenParamsTypes';
import LandingScreen from '../../screens/landingScreen/LandingScreen';
import Login from '../../screens/login/Login';
import StepTwoLogin from '../../screens/login/StepTwoLogin';
import StepThreeLoginPassword from '../../screens/login/StepThreeLoginPassword';
import Signup from '../../screens/signup/Signup';
import CreateNewPassword from '../../screens/createNewPassword/CreateNewPassword';
import ForgotPassword from '../../screens/forgotPassword/ForgotPassword';
import SendOtp from '../../components/shared/sendOtp/SendOtp';

export type UnAuthenticatedStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  SendOtp: IOtpScreenParamsTypes;
  CreateNewPassword: object;
  LandingScreen: undefined;
  StepTwoLogin: {phoneNumber: string; previousStepResponse: any};
  StepThreeLoginPassword: {userName: string};
};
const Stack = createNativeStackNavigator<UnAuthenticatedStackParamList>();

const UnauthenticatedStack = () => {
  return (
    <Stack.Navigator initialRouteName={'LandingScreen'}>
      <Stack.Screen
        name="LandingScreen"
        options={{headerShown: false}}
        component={LandingScreen}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StepTwoLogin"
        component={StepTwoLogin}
        options={{title: 'Choose an account'}}
      />
      <Stack.Screen
        name="StepThreeLoginPassword"
        component={StepThreeLoginPassword}
        options={{title: 'Enter Password'}}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen name="SendOtp" component={SendOtp} />
      <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
    </Stack.Navigator>
  );
};

export default UnauthenticatedStack;
