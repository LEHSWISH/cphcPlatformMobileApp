import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {Colors} from '../../styles';
import {abhaServiceCardData} from '../../utils/serviceCardData/ServiceCardData';
import ServicesCard from '../../components/shared/servicesCard/ServicesCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modal, Portal} from 'react-native-paper';
import AppText from '../../components/shared/text/AppText';
import {variable} from '../../styles/colors';

const CreateAbhaNumber = () => {
  const navigation =
    useNavigation<NavigationProp<HomeFragmentStackParamList>>();
  const [visible, setVisible] = useState<boolean>(false);
  const openModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.sectionDescription}>
          Please choose one of the below option to start with the creation of
          your ABHA number
        </Text>
        <View style={styles.serviceCard}>
          {abhaServiceCardData.map((item, index) => {
            return (
              <ServicesCard
                title={item.title}
                subTitle={item.subTitle}
                imageLogo={item.imageLogo}
                navigateTo={item.navigateTo}
                key={index}
              />
            );
          })}
        </View>
        <View style={styles.linkAbha}>
          <Text>Already have ABHA number? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('LinkAbhaMethodSelection')}>
            <Text style={styles.textButton}>Link ABHA</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={openModal}>
          <View style={styles.knowAboutAbha}>
            <Icon
              name="information-outline"
              size={20}
              style={styles.knowAbhaIcon}
            />
            <AppText customStyles={styles.knowAbhaText}>
              Know more about ABHA
            </AppText>
          </View>
        </TouchableOpacity>
        <Portal>
          <Modal
            visible={visible}
            contentContainerStyle={styles.abhaDescriptionStyle}
            onDismiss={hideModal}>
            <AppText customStyles={styles.abhaDescriptionHeading}>
              Ayushman Bharat Health Account (ABHA Number)
            </AppText>
            <AppText customStyles={styles.abhaDescriptionText}>
              Abha number is a 14 digit that will uniquely identify you as a
              participant in India digital healthcare ecosytem. ABHA Number
              establish a strong and trustable identity for that will be
              accepted by healthcare provider payers across the country
            </AppText>
          </Modal>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAbhaNumber;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  wrapper: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 50,
    justifyContent: 'flex-start',
    gap: 40,
  },
  sectionDescription: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    color: Colors.primary.textColor,
    textAlign: 'center',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    gap: 12,
    width: 'auto',
  },
  textButton: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'left',
    color: Colors.primary.brand,
    textDecorationLine: 'underline',
  },
  linkAbha: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  knowAboutAbha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '25%',
  },
  knowAbhaIcon: {
    color: Colors.primary.brand,
    paddingRight: 5,
  },
  knowAbhaText: {
    color: Colors.primary.brand,
    fontWeight: '500',
    fontSize: 14,
  },
  abhaDescriptionStyle: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    height: 200,
    width: '90%',
    borderRadius: 8,
  },
  abhaDescriptionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: variable.primary,
    marginVertical: 15,
  },
  abhaDescriptionText: {
    fontSize: 14,
    fontWeight: '400',
  },
});
