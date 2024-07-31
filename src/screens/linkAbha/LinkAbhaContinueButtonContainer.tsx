import React from 'react';
import {View} from 'react-native-ui-lib';
import {StyleSheet, Text} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import ButtonComponent from '../../components/shared/button/ButtonComponent';

interface LinkAbhaContinueButtonContainerPropType {
  onPress: () => void;
  buttonLabel?: string;
}
const LinkAbhaContinueButtonContainer = ({
  onPress,
  buttonLabel = 'Continue',
}: LinkAbhaContinueButtonContainerPropType) => {
  const navigation =
    useNavigation<NavigationProp<HomeFragmentStackParamList>>();
  return (
    <View style={styles.container}>
      <ButtonComponent label={buttonLabel} onPress={onPress} />
      <Text style={styles.submitButtonSubText}>
        Don’t have ABHA number?
        <ButtonComponent
          label="Create ABHA"
          onPress={() => navigation.navigate('EnterAadhar')}
          type="text-button"
        />
      </Text>
    </View>
  );
};

export default LinkAbhaContinueButtonContainer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  submitButtonSubText: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
