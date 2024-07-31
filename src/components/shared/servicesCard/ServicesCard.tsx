/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-paper';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ServiceCardType} from '../../../enums/serivceCardType/ServiceCardType';
import {HomeFragmentStackParamList} from '../../../navigation/stack/HomeFragmentStack';

// type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
const ServicesCard = (props: any) => {
  const nav = useNavigation<NavigationProp<HomeFragmentStackParamList>>();
  const isLinked = props?.status === 'Linked';

  return (
    <TouchableOpacity
      onPress={() => {
        if (props?.navigateTo) {
          nav.navigate(props?.navigateTo);
        }
      }}
      style={[
        styles.cardWrapper,
        props.type === ServiceCardType.Full_Width_Card &&
          styles.cardWrapperFullWidth,
      ]}>
      <View style={styles.card}>
        <Image source={props?.imageLogo} />
        <Text style={styles.sectionHeading}>{props?.title}</Text>
        <Text style={styles.sectionSubHeading}>{props?.subTitle}</Text>
        {props?.status && (
          <View
            style={[styles.linkedStatus, isLinked && styles.linkedStatusTrue]}>
            <Text
              style={[
                styles.linkedStatusText,
                isLinked && styles.linkedStatusTextTrue,
              ]}>
              {' '}
              <Icon
                source={props?.status === 'Linked' ? 'check' : 'close'}
                size={10}
                color={props?.status === 'Linked' ? '#337D38' : '#C7413A'}
              />
              {props?.status}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ServicesCard;

const styles = StyleSheet.create({
  cardWrapperFullWidth: {
    width: '100%',
  },
  cardWrapper: {
    width: 168,
    height: 132,
    padding: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    position: 'relative',
    backgroundColor: '#FBF8FF',
  },
  card: {
    width: '100%',
  },
  sectionHeading: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 10,
  },
  sectionSubHeading: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    color: '#6C6969',
  },
  linkedStatusTrue: {
    backgroundColor: '#337D3814',
  },
  linkedStatus: {
    width: 72,
    height: 18,
    position: 'absolute',
    right: 0,
    top: 10,
    borderRadius: 12,
    paddingTop: 5,
    paddingRight: 12,
    paddingBottom: 3,
    paddingLeft: 6,
    backgroundColor: '#C7413A14',
  },
  linkedStatusTextTrue: {
    color: '#337D38',
  },
  linkedStatusText: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 10,
    textAlign: 'center',
    color: '#C7413A',
  },
});
