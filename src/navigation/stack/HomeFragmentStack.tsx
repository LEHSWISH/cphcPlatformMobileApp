import React from 'react';

// Navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import LocateRhfFindView from '../../screens/locateRhf/LocateRhfFindView';
import RhfListView from '../../screens/locateRhf/RhfListView';
import Home from '../../screens/home/Home';
import OnBoardingScreen from '../../screens/onBoardingScreen/OnBoardingScreen';
import AadharAuthentication from '../../screens/createAbhaNumber/AadharAuthentication';
import AadharTermsAndConditions from '../../screens/createAbhaNumber/AadharTermsAndConditions';
import Abha from '../../screens/createAbhaNumber/Abha';
import AbhaCommunicationOtpVerification from '../../screens/createAbhaNumber/AbhaCommunicationOtpVerification';
import CreateAbhaAddress from '../../screens/createAbhaNumber/CreateAbhaAddress';
import CreateAbhaNumber from '../../screens/createAbhaNumber/CreateAbhaNumber';
import EnterAadhar from '../../screens/createAbhaNumber/EnterAadhar';
import {useAppSelector} from '../../components/shared/hooks/useAppSelector';
import {GetUserInfoByIDTP_ApiResponseType} from '../../services/ApiHelpers/CreateAbhaApi';
import CreateAbhaViaTourismId from '../../screens/createAbhaViaTourismId/CreateAbhaViaTourismId';
import CreateViaTourismIdAadharDetails from '../../screens/createAbhaViaTourismId/CreateAbhaViaTourismAadharDetails';
import YatriDetails from '../../screens/yatriDetails/YatriDetails';
import PhoneNumberUpdateVerification from '../../screens/yatriDetails/PhoneNumberUpdateVerification';
import {UpdateYartriDetailsPayloadType} from '../../interfaces/apiResponseTypes/ApiRequestPayoadTypes';
import LinkAbhaMethodSelection from '../../screens/linkAbha/LinkAbhaMethodSelection';
import LinkAbhaSelectOtpMethod, {
  LinkAbhaSelectOtpMethodParamsType,
} from '../../screens/linkAbha/LinkAbhaSelectOtpMethod';
import LinkAbhaOtpVerification, {
  LinkAbhaRouteParamsPropType,
} from '../../screens/linkAbha/LinkAbhaOtpVerification';
import LinkAbhaSelectAbhaAddress, {
  LinkAbhaSelectAbhaAddressParamsType,
} from '../../screens/linkAbha/LinkAbhaSelectAbhaAddress';
import RecoverAbha from '../../screens/recoverAbha/RecoverAbha';
import RecoverAbhaOtpVerification, {
  RecoverAbhaOtpVerificationParamsPropType,
} from '../../screens/recoverAbha/RecoverAbhaOtpVerification';
import RecoverAbhaSelectAbhaAddress, {
  RecoverAbhaSelectAbhaAddressParamsType,
} from '../../screens/recoverAbha/RecoverAbhaSelectAbhaAddress';
import AddTourismPortalId from '../../screens/addTourismPortalId/AddTourismPortalId';
import AddTourismPortalIdFormTwo from '../../screens/addTourismPortalId/AddTourismPortalIdFormTwo';
import FAQAllContent, {
  FAQRoutesType,
} from '../../screens/FAQContent/FAQAllContent';

export type HomeFragmentStackParamList = {
  LocateRhfFindView: any;
  RhfListView: {
    stateCode: string;
    districtCode: string;
  };
  Home: any;
  FAQAllContent: FAQRoutesType;
  OnBoardingScreen: undefined;
  CreateAbhaNumber: any;
  EnterAadhar: any;
  AadharTermsAndCondition: any;
  AadharAuthentication: any;
  AbhaCommunicationOtpVerification: any;
  CreateAbhaAddress: any;
  Abha: any;
  CreateAbhaViaTourismId: undefined;
  CreateAbhaByTourismPortalIDFormTwo: {
    response: GetUserInfoByIDTP_ApiResponseType;
  };
  PhoneNumberUpdateVerification: {
    payload: UpdateYartriDetailsPayloadType;
  };
  LinkAbhaMethodSelection: undefined;
  LinkAbhaSelectOtpMethod: LinkAbhaSelectOtpMethodParamsType;
  LinkAbhaOtpVerification: LinkAbhaRouteParamsPropType;
  LinkAbhaSelectAbhaAddress: LinkAbhaSelectAbhaAddressParamsType;
  RecoverAbha: undefined;
  RecoverAbhaOtpVerification: RecoverAbhaOtpVerificationParamsPropType;
  RecoverAbhaSelectAbhaAddress: RecoverAbhaSelectAbhaAddressParamsType;
  AddTourismPortalId: undefined;
  AddTourismPortalIdFormTwo: {
    response: GetUserInfoByIDTP_ApiResponseType;
  };
};
const HomeFragmentStackNavigator =
  createNativeStackNavigator<HomeFragmentStackParamList>();
const HomeFragmentStack = () => {
  const fullName = useAppSelector(
    s => s.yatri.yatriAllDetails.data?.yatriDetails?.fullName,
  );
  return (
    <>
      <HomeFragmentStackNavigator.Navigator
        initialRouteName={fullName ? 'Home' : 'OnBoardingScreen'}>
        <>
          <HomeFragmentStackNavigator.Screen
            name="OnBoardingScreen"
            component={OnBoardingScreen}
            options={{
              headerShown: false,
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <HomeFragmentStackNavigator.Screen
            name="FAQAllContent"
            component={FAQAllContent}
            options={{
              title: 'FAQ',
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="LocateRhfFindView"
            component={LocateRhfFindView}
            options={{
              title: 'Locate Registered Health Facility',
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="RhfListView"
            component={RhfListView}
            options={{
              title: 'Medical Facility',
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="CreateAbhaNumber"
            component={CreateAbhaNumber}
            options={{
              title: 'Create ABHA Number',
              headerBackTitleVisible: false,
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="EnterAadhar"
            component={EnterAadhar}
            options={{
              title: 'Enter Aadhar',
              headerBackTitleVisible: false,
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="AadharTermsAndCondition"
            component={AadharTermsAndConditions}
            options={{
              title: 'Terms and Conditions',
              headerBackTitleVisible: false,
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="AadharAuthentication"
            component={AadharAuthentication}
            options={{
              title: 'Aadhaar Authentication',
              headerBackTitleVisible: false,
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="AbhaCommunicationOtpVerification"
            component={AbhaCommunicationOtpVerification}
            options={{
              title: 'OTP Verification ',
              headerBackTitleVisible: false,
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="CreateAbhaAddress"
            component={CreateAbhaAddress}
            options={{
              title: 'Create ABHA address ',
              headerBackTitleVisible: false,
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="Abha"
            component={Abha}
            options={{
              title: 'ABHA',
              headerBackTitleVisible: false,
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="CreateAbhaViaTourismId"
            component={CreateAbhaViaTourismId}
            options={{
              title: 'Tourism Portal ID',
              headerBackTitleVisible: false,
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="CreateAbhaByTourismPortalIDFormTwo"
            component={CreateViaTourismIdAadharDetails}
            options={{title: 'Aadhaar Details', headerBackTitleVisible: false}}
          />
          <HomeFragmentStackNavigator.Screen
            name="YatriDetails"
            component={YatriDetails}
            options={{title: 'Profile Details'}}
          />
          <HomeFragmentStackNavigator.Screen
            name="PhoneNumberUpdateVerification"
            component={PhoneNumberUpdateVerification}
            options={{
              title: 'OTP Verification',
              headerBackTitleVisible: false,
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="LinkAbhaMethodSelection"
            component={LinkAbhaMethodSelection}
            options={{
              title: 'Link your ABHA',
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="LinkAbhaSelectOtpMethod"
            component={LinkAbhaSelectOtpMethod}
            options={{
              title: 'Link your ABHA',
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="LinkAbhaOtpVerification"
            component={LinkAbhaOtpVerification}
            options={{
              title: 'OTP Verification',
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="LinkAbhaSelectAbhaAddress"
            component={LinkAbhaSelectAbhaAddress}
            options={{
              title: 'Select ABHA Address',
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="RecoverAbha"
            component={RecoverAbha}
            options={{
              title: 'Recover ABHA Number',
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="RecoverAbhaOtpVerification"
            component={RecoverAbhaOtpVerification}
            options={{
              title: 'OTP Verification',
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="RecoverAbhaSelectAbhaAddress"
            component={RecoverAbhaSelectAbhaAddress}
            options={{
              title: 'Select ABHA Account',
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="AddTourismPortalId"
            component={AddTourismPortalId}
            options={{
              title: 'Toursim Portal ID',
            }}
          />
          <HomeFragmentStackNavigator.Screen
            name="AddTourismPortalIdFormTwo"
            component={AddTourismPortalIdFormTwo}
            options={{
              title: 'Tourism Portal ID',
            }}
          />
        </>
      </HomeFragmentStackNavigator.Navigator>
    </>
  );
};

export default HomeFragmentStack;
