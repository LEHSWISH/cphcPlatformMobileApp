import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import {Colors} from '../../styles';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppText from '../../components/shared/text/AppText';
import ButtonComponent from '../../components/shared/button/ButtonComponent';

type AadharTermsAndConditionsPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'AadharTermsAndCondition'
>;

const AadharTermsAndConditions = ({
  navigation,
  route,
}: AadharTermsAndConditionsPropTypes) => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <AppText customStyles={styles.termsDescription}>
          I am voluntarily sharing my Aadhaar Number / Virtual ID issued by the
          Unique Identification Authority of India ("UIDAI"), and my demographic
          information for the purpose of creating an Ayushman Bharat Health
          Account number ("ABHA number") and Ayushman Bharat Health Account
          address ("ABHA Address"). I authorize NHA to use my Aadhaar number /
          Virtual ID for performing Aadhaar based authentication with UIDAI as
          per the provisions of the Aadhaar (Targeted Delivery of Financial and
          other Subsidies, Benefits and Services) Act, 2016 for the aforesaid
          purpose.
        </AppText>
        <AppText customStyles={styles.termsDescription}>
          I understand that UIDAI will share my e-KYC details, or response of
          "Yes" with NHA upon successful authentication.
        </AppText>
        <ButtonComponent
          customButtonStyle={styles.agreeButton}
          label="I agree"
          onPress={() => {
            route?.params?.acceptTermsAndCondition(true);
            navigation.goBack();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AadharTermsAndConditions;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  scrollView: {
    flexGrow: 1,
    gap: 20,
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  termsDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  agreeButton: {
    marginTop: 'auto',
  },
});
