import React, {useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppSelector} from '../../../components/shared/hooks/useAppSelector';
import {useAppDispatch} from '../../../components/shared/hooks/useAppDispatch';
import {logoutYatri} from '../../../services/store/slices/authSlice';
import {
  AccountProfileIcon,
  BellIcon,
  LogoutIcon,
  profileBackgroundImage,
} from '../../../assets/images';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeFragmentStackParamList} from '../../stack/HomeFragmentStack';
import {variable} from '../../../styles/colors';
import AppText from '../../../components/shared/text/AppText';
import {Image} from 'react-native';

const DrawerMenuContent = () => {
  const dispatch = useAppDispatch();
  const userName = useAppSelector(s => s.auth.yatri.userName);
  const navigation =
    useNavigation<NavigationProp<HomeFragmentStackParamList>>();
  const fullName = useAppSelector(
    s => s.yatri.yatriAllDetails.data?.yatriDetails?.fullName,
  );

  const handleOnLogout = useCallback(() => dispatch(logoutYatri()), [dispatch]);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContentcontainer}>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('YatriDetails', {});
          }}>
          <ImageBackground
            source={profileBackgroundImage}
            resizeMode="cover"
            style={styles.profileCardContainer}>
            <AccountProfileIcon style={styles.accountProfileImage} />
            <View style={styles.profileTextContainer}>
              <Text style={styles.profilePrimaryText}>Hi {fullName}</Text>
              <Text style={styles.profileSecondryText}>{userName}</Text>
            </View>
            <Icon name="chevron-right" size={18} style={styles.feviconRight} />
          </ImageBackground>
        </TouchableOpacity>
        <View style={styles.optionsCardContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <BellIcon />
            <Text style={styles.optionItemText}>Notification</Text>
            <Icon name="chevron-right" size={18} style={styles.feviconRight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={handleOnLogout}>
            <LogoutIcon />
            <Text style={styles.optionItemText}>Logout</Text>
            <Icon name="chevron-right" size={18} style={styles.feviconRight} />
          </TouchableOpacity>
        </View>
        <View style={styles.versionAndLogoContainer}>
          <AppText customStyles={styles.appVersionText}>
            App Version 1.0
          </AppText>
          <Image
            source={require('../../../assets/images/wishfoundation.png')}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default DrawerMenuContent;

const styles = StyleSheet.create({
  scrollViewContentcontainer: {
    flex: 1,
    backgroundColor: variable.whiteBackground,
  },
  optionsContainer: {
    marginVertical: 15,
    paddingHorizontal: 20,
    gap: 12,
    flexGrow: 1,
  },
  profileCardContainer: {
    padding: 21,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(51, 24, 159, 0.05)',
  },
  accountProfileImage: {
    width: 47,
    height: 47,
  },
  profileTextContainer: {
    gap: 12,
  },
  profilePrimaryText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'left',
    color: 'rgba(32, 32, 32, 1)',
  },
  profileSecondryText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16.5,
    textAlign: 'left',
    color: 'rgba(32, 32, 32, 1)',
  },
  optionsCardContainer: {
    borderColor: 'rgba(108, 105, 105, 0.2)',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  optionItemText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17,
    textAlign: 'left',
  },
  feviconRight: {
    marginLeft: 'auto',
  },
  versionAndLogoContainer: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appVersionText: {
    alignSelf: 'flex-end',
    fontSize: 12,
    fontWeight: '400',
    color: variable.descriptionText,
  },
});
