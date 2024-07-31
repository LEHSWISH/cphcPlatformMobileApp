import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Text} from 'react-native-paper';
import {Colors} from '../../../styles';
import {RhfFacilityType} from '../../../interfaces/apiResponseTypes/RegionalHealthFacilityResponseTypes';

interface ListItemPropTypes {
  item: RhfFacilityType;
}

const ListItem = ({item}: ListItemPropTypes) => {
  const {t} = useTranslation();

  return (
    <View style={style.wrapper}>
      <Text style={style.title}>{item.facilityName}</Text>
      <View style={style.pairContainer}>
        <Text style={style.label}>{t('locate_RHF.label_search')} :</Text>
        <Text style={style.value}>{item.facilityId}</Text>
      </View>
      <View style={style.pairContainer}>
        <Text style={style.label}>{t('locate_RHF.label_facility_type')} :</Text>
        <Text style={style.value}>{item.facilityType}</Text>
      </View>
      <View style={style.pairContainer}>
        <Text style={style.label}>{t('locate_RHF.label_Ownership')} :</Text>
        <Text style={style.value}>{item.ownership}</Text>
      </View>
      <View style={style.pairContainer}>
        <Text style={style.label}>{t('locate_RHF.label_address')} :</Text>
        <Text style={style.value}>{item.address}</Text>
      </View>
      <View style={style.pairContainer}>
        <Text style={style.label}>
          {t('locate_RHF.label_facility_status')} :
        </Text>
        <Text style={style.value}>{item.facilityStatus}</Text>
      </View>
      <View style={style.pairContainer}>
        <Text style={style.label}>{t('locate_RHF.label_abdm_enabled')} :</Text>
        <Text style={style.value}>{item.abdmEnabled ? 'Yes' : 'No'}</Text>
      </View>
    </View>
  );
};

export default ListItem;

const style = StyleSheet.create({
  wrapper: {
    gap: 5,
  },
  title: {
    fontFamily: 'Roboto-Medium',
    color: Colors.neutral.s800,
    fontSize: 16,
  },
  label: {
    width: '44%',
    fontSize: 14,
    fontFamily: 'Roboto',
    color: Colors.neutral.black,
  },
  value: {
    width: '56%',
    fontSize: 14,
    fontFamily: 'Roboto',
    color: Colors.neutral.black,
  },
  pairContainer: {
    flexDirection: 'row',
  },
});
