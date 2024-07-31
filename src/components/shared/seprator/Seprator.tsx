import React from 'react';
import {StyleSheet, View} from 'react-native';

function Seprator() {
  return <View style={styles.seprator} />;
}

export default Seprator;

const styles = StyleSheet.create({
  seprator: {
    height: 1,
    width: '100%',
    backgroundColor: '#6C696980',
  },
});
