import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {variable} from '../../styles/colors';
import {Colors} from '../../styles';
import {Formik} from 'formik';
import {TextInput} from 'react-native-paper';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import {onBoardingScheme} from '../../validations/login/loginValidation';
import {UpdateYartriDetailsPayloadType} from '../../interfaces/apiResponseTypes/ApiRequestPayoadTypes';
import {useAppSelector} from '../../components/shared/hooks/useAppSelector';
import YatriDetailsAPI from '../../services/ApiHelpers/YatriDetailsAPI';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {loadYatriAllData} from '../../services/store/slices/yatriSlice';
import {t} from 'i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
const NamasteOnboardingImage = require('../../assets/images/NamasteOnboarding.png');

type onBoardingNavigationProps = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'OnBoardingScreen'
>;

const OnBoardingScreen = ({navigation}: onBoardingNavigationProps) => {
  const dispatch = useAppDispatch();
  const phoneNumber =
    useAppSelector(s => s.yatri.yatriAllDetails.data?.phoneNumber) || '';

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.sectionOne}>
          <Text style={styles.heading}>Namaste!</Text>
          <Text style={styles.subHeading}>
            Welcome to YatriPulse - your one-stop companion for health-infused
            travel adventures.
          </Text>
          <View style={styles.imageContainer}>
            <Image
              source={NamasteOnboardingImage}
              style={styles.onboardingImage}
            />
          </View>
        </View>
        <View style={styles.sectionTwo}>
          <View style={styles.divisionSection}>
            <View style={styles.beforeContent} />
            <Text style={styles.divisionText}>Let`s Begin</Text>
            <View style={styles.afterContent} />
          </View>
          <Text style={styles.description}>
            Personalize your experience by entering your name
          </Text>
          <Formik
            validationSchema={onBoardingScheme}
            initialValues={{
              fullName: '',
            }}
            onSubmit={values => {
              const payload: UpdateYartriDetailsPayloadType = {
                yatriDetails: {
                  fullName: values.fullName,
                },
                phoneNumber: phoneNumber,
              };
              YatriDetailsAPI.updateYatriDetailsApi({...payload})
                .then(() => {
                  dispatch(
                    setSnackBar({
                      message: 'Full name added successfully',
                      visible: true,
                    }),
                  );
                  dispatch(loadYatriAllData());
                  navigation.replace('Home');
                })
                .catch(() => {
                  dispatch(
                    setSnackBar({
                      message: t('common_error_messages.something_went_wrong'),
                      visible: true,
                    }),
                  );
                });
            }}>
            {({values, handleChange, handleSubmit, errors}) => (
              <>
                <TextInput
                  style={styles.inputFieldStyle}
                  label={
                    <Text>
                      Full Name
                      <Text style={styles.asteriskSignStyle}> *</Text>
                    </Text>
                  }
                  mode="flat"
                  placeholder="Enter your full name"
                  value={values.fullName}
                  onChangeText={handleChange('fullName')}
                />
                {errors?.fullName && (
                  <Text style={styles.errorText}>{errors?.fullName}</Text>
                )}
                <ButtonComponent
                  onPress={() => {
                    handleSubmit();
                  }}
                  label={'Let’s get started!'}
                />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnBoardingScreen;

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
  },
  sectionOne: {
    flex: 0.45,
  },
  sectionTwo: {
    flex: 0.65,
    marginTop: 10,
  },
  heading: {
    color: Colors.variable.blackTextColor,
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 32,
    paddingVertical: 12,
  },
  subHeading: {
    color: Colors.variable.blackTextColor,
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
  },
  description: {
    color: Colors.variable.descriptionText,
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 50,
    paddingVertical: 45,
  },
  imageContainer: {
    marginTop: 'auto',
  },
  onboardingImage: {
    alignSelf: 'center',
  },
  divisionSection: {
    position: 'relative',
    marginHorizontal: 25,
    marginVertical: 15,
  },
  beforeContent: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: '35%',
    height: '10%',
    backgroundColor: 'rgba(108, 105, 105, 1)',
    zIndex: -1,
  },
  afterContent: {
    position: 'absolute',
    top: 10,
    right: 0,
    width: '35%',
    height: '10%',
    backgroundColor: 'rgba(108, 105, 105, 1)',
    zIndex: -1,
  },
  divisionText: {
    color: Colors.variable.blackTextColor,
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '700',
    textAlign: 'center',
  },
  inputFieldStyle: {
    backgroundColor: '#fff',
    color: '#202020',
    margin: 12,
  },
  asteriskSignStyle: {
    color: Colors.variable.danger,
    fontSize: 16,
  },
  errorText: {
    color: Colors.variable.danger,
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 10,
    paddingLeft: 25,
  },
});
