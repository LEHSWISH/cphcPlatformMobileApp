import {StyleSheet, Text, TextStyle} from 'react-native';
import React from 'react';

interface AppTextPropType {
  children: string;
  customStyles?: TextStyle;
}
const AppText = ({children, customStyles}: AppTextPropType) => {
  return (
    <>
      <Text style={[styles.fontFamily, customStyles || {}]}>{children}</Text>
    </>
  );
};

export default AppText;

const styles = StyleSheet.create({
  fontFamily: {
    fontFamily: 'Roboto',
  },
});
