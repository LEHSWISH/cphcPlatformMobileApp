import React from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {Portal} from 'react-native-paper';
import {Colors} from '../../styles';

const FullScreenLoader = () => {
  return (
    <Portal>
      <View style={styles.container}>
        <ActivityIndicator
          animating={true}
          color={Colors.primary.brand}
          size={Platform.OS === 'android' ? 45 : 'large'}
          style={styles.activityIndicator}
        />
      </View>
    </Portal>
  );
};

export default FullScreenLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  activityIndicator: {
    flex: 1,
  },
});
