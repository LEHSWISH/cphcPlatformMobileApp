import {StyleSheet, View} from 'react-native';
import React from 'react';
import AppText from '../../shared/text/AppText';
import {variable} from '../../../styles/colors';
import ButtonComponent from '../../shared/button/ButtonComponent';
import {ButtonType} from '../../../enums/buttonType/ButtonType';

interface propsType {
  onPress: () => void;
  data: string;
  type: string;
}
const LoginBadge = ({onPress, data, type}: propsType) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <AppText customStyles={styles.heading}>
            {type + ' ' + '-' + ' '}
          </AppText>
          <AppText customStyles={styles.value}>{data}</AppText>
        </View>
        <View>
          <ButtonComponent
            label={'Change'}
            type={ButtonType.TEXT_BUTTON}
            onPress={onPress}
          />
        </View>
      </View>
    </>
  );
};

export default LoginBadge;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 8,
    backgroundColor: variable.primaryWithLightShade,
  },
  heading: {
    color: variable.blackTextColor,
    fontSize: 14,
    fontWeight: '400',
  },
  value: {
    color: variable.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
