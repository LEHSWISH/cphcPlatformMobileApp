import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../styles';

const FAQ = ({title, details}: {title: string; details: string}) => {
  const [opened, setOpened] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const numberOfWords = details.split(' ').length;

  const heigntAnimationInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (numberOfWords / 2.6) * 10],
  });

  const toggleAccordion = () => {
    if (!opened) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
    setOpened(!opened);
  };
  if (!title && !details) {
    return;
  }
  return (
    <>
      <View style={styles.faqWrapper}>
        <View>
          <TouchableWithoutFeedback onPress={toggleAccordion}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqTitle}>{title}</Text>
              <View style={styles.icon}>
                <Icon
                  name={opened ? 'minus-circle' : 'plus-circle'}
                  size={20}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.faqContentContainer,
              {height: heigntAnimationInterpolation},
            ]}>
            <Text style={styles.faqContent}>{details}</Text>
          </Animated.View>
        </View>
      </View>
    </>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  faqWrapper: {
    marginHorizontal: 8,
    marginVertical: 4,
    paddingVertical: 12,
    borderRadius: 6,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  icon: {
    paddingLeft: 15,
  },
  faqTitle: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    flex: 1,
  },
  faqContentContainer: {
    marginTop: 8,
  },
  faqContent: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.neutral.s500,
  },
});
