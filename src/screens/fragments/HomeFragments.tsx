import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import ServicesCard from '../../components/shared/servicesCard/ServicesCard';
import serviceCardData from '../../utils/serviceCardData/ServiceCardData';
import {Colors} from '../../styles';
import {useAppSelector} from '../../components/shared/hooks/useAppSelector';
import FAQSection from '../../components/core/faq/FAQSection';
import {variable} from '../../styles/colors';
import {ServiceCardType} from '../../enums/serivceCardType/ServiceCardType';

const HomeFragments = () => {
  const abhaNumber = useAppSelector(
    s => s.yatri.yatriAllDetails.data?.abhaUserDetails?.ABHANumber,
  );
  return (
    <>
      <ScrollView>
        <View>
          <View style={styles.welcomeTextSection}>
            <Text style={styles.welcomeText}>Welcome to YatriPulse!</Text>
            <Text style={styles.welcomeDescription}>
              Experience peace of mind on your journey with our dedicated health
              support at every turn.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.serviceText}>Services</Text>
            <View style={styles.serviceCard}>
              {serviceCardData(abhaNumber ?? '').map((item, index) => {
                return (
                  <ServicesCard
                    type={ServiceCardType.Full_Width_Card}
                    title={item.title}
                    subTitle={item.subTitle}
                    imageLogo={item.imageLogo}
                    status={item.status}
                    key={index}
                    navigateTo={item.navigateTo}
                  />
                );
              })}
            </View>
          </View>
          <FAQSection />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: variable.whiteBackground,
    padding: 20,
    margin: 10,
    height: 467,
    width: 369,
    borderRadius: 8,
  },
  yatriDetailsModalDescription: {
    height: '25%',
  },
  yatriDetailsModalFormField: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '75%',
  },
  welcomeTextSection: {
    paddingHorizontal: 20,
  },

  welcomeText: {
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '500',
    color: variable.primary,
    textAlign: 'center',
    paddingTop: 35,
  },
  welcomeDescription: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    color: variable.blackTextColor,
    paddingVertical: 10,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 15,
  },
  serviceText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '500',
    color: variable.blackTextColor,
    paddingVertical: 20,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    gap: 10,
  },
  modalHeading: {
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary.brand,
    paddingVertical: 15,
  },
  modalSubHeading: {
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral.s500,
  },
  errorText: {
    color: variable.danger,
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 10,
    paddingLeft: 25,
  },
  formInputStyle: {
    backgroundColor: variable.whiteBackground,
    color: variable.blackTextColor,
    margin: 12,
  },
  ctaButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary.brand,
    borderRadius: 8,
    margin: 35,
    paddingHorizontal: 58,
    paddingVertical: 8,
  },
  ctaButtonText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeFragments;
