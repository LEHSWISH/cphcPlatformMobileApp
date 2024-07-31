import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GroupHeartImage} from '../../assets/images';

const Vitals = () => {
  return (
    <>
      <View style={style.vitalPage}>
        <GroupHeartImage style={style.vitalPng} />
        <View style={style.textView}>
          <Text style={style.textComingSoon}>Coming Soon...</Text>
          <Text style={style.paragraph}>
            We are currently working on this page.
          </Text>
        </View>
      </View>
    </>
  );
};

const style = StyleSheet.create({
  vitalPage: {
    backgroundColor: 'white',
    height: '100%',
    alignItems: 'center',
    paddingTop: 160,
    gap: 30,
    flex: 1,
  },
  vitalPng: {
    width: 112,
    height: 80,
  },
  textView: {
    gap: 16,
  },
  textComingSoon: {
    fontFamily: 'Roboto',
    fontSize: 40,
    fontWeight: '500',
    color: 'black',
    lineHeight: 46.88,
    textAlign: 'center',
  },
  paragraph: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 18.75,
    textAlign: 'center',
    color: 'rgba(108, 105, 105, 1)',
  },
});

export default Vitals;
