import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {variable} from '../../styles/colors';
import UserList from '../../components/core/userLIst/UserList';
import LoginBadge from '../../components/core/loginBadge/LoginBadge';
import {UnAuthenticatedStackParamList} from '../../navigation/stack/UnAuthenticatedStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type StepTwoLoginProps = NativeStackScreenProps<
  UnAuthenticatedStackParamList,
  'StepTwoLogin'
>;

const StepTwoLogin = ({navigation, route}: StepTwoLoginProps) => {
  const userListData = route?.params?.previousStepResponse?.users;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.sectionOne}>
          <LoginBadge
            type="Phone number"
            data={route?.params?.phoneNumber}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <View style={styles.sectionTwo}>
          <ScrollView automaticallyAdjustKeyboardInsets={true}>
            <UserList data={userListData} navigation={navigation} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StepTwoLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: variable.whiteBackground,
  },
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  sectionOne: {
    flex: 0.25,
    justifyContent: 'center',
  },
  sectionTwo: {
    flex: 0.75,
  },
});
