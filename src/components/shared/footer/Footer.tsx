import {View, StyleSheet, Image} from 'react-native';
import React from 'react';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.wishLogoWrapper}>
        <Image
          style={styles.wishLogoImage}
          source={require('../../../assets/images/wishfoundation.png')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#33189f0d',
    height: 58,
    width: '100%',
  },
  wishLogoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  wishLogoImage: {
    height: 42,
    width: 80,
  },
});
export default Footer;
