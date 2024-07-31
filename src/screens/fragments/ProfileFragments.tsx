import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {accountProfileImage} from '../../assets/images/iconImages/iconImage';

const ProfileFragments = () => {
  return (
    <View>
      <View style={styles.accountProfileContainer}>
        <View style={styles.accountProfile}>
          <Image source={accountProfileImage} />
          <Text style={styles.accountName}>John Doe</Text>
          <View style={styles.percentageStatus}>
            <Text style={styles.percentageStatusText}>80% Completed</Text>
          </View>
        </View>
        <View style={styles.profileDetailsContainer}>
          <View style={styles.profileDetailsSection}>
            <Text style={styles.profileDetailsText}>Username</Text>
            <Text style={[styles.profileDetailsText, {fontWeight: '500'}]}>
              johndoe0783
            </Text>
          </View>
          <View style={styles.profileDetailsSection}>
            <Text style={styles.profileDetailsText}>Phone number</Text>
            <Text style={[styles.profileDetailsText, {fontWeight: '500'}]}>
              +91 9876543210
            </Text>
          </View>
          <View style={styles.profileDetailsSection}>
            <Text style={styles.profileDetailsText}>Aadhaar number</Text>
            <Text style={[styles.profileDetailsText, {fontWeight: '500'}]}>
              4312 5842 8971
            </Text>
          </View>
          <View style={styles.profileDetailsSection}>
            <Text style={styles.profileDetailsText}>Tourism Portal ID</Text>
            <Text style={[styles.profileDetailsText, styles.textButton]}>
              Add ID
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.detailsSection, styles.accountProfileContainer]}>
        <View>
          <Text style={styles.detailsText}>
            <Icon name="clipboard-list-outline" size={18} /> Yatri Details{' '}
            <View
              style={[
                styles.linkedStatus,
                {
                  backgroundColor: '#C7413A14',
                },
              ]}>
              <Text style={[styles.linkedStatusText, {color: '#C7413A'}]}>
                <Icon name="alert-circle-outline" size={10} color="#C7413A" />
                Pending
              </Text>
            </View>
          </Text>
        </View>
        <Text style={[styles.profileDetailsText, styles.textButton]}>Add</Text>
      </View>
      <View style={[styles.detailsSection, styles.accountProfileContainer]}>
        <View>
          <Text style={styles.detailsText}>
            <Icon name="logout" size={18} /> Logout
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileFragments;

const styles = StyleSheet.create({
  accountProfileContainer: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#20202033',
  },
  accountProfile: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  accountName: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    color: '#17272F',
    paddingVertical: 10,
  },
  percentageStatus: {
    backgroundColor: '#337D3814',
    borderRadius: 12,
    paddingTop: 5,
    paddingRight: 18,
    paddingBottom: 5,
    paddingLeft: 18,
    height: 24,
  },
  percentageStatusText: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    color: '#337D38',
  },
  profileDetailsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
  },
  profileDetailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    paddingVertical: 8,
  },
  profileDetailsText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    color: '#202020',
  },
  textButton: {
    color: '#33189F',
    textDecorationLine: 'underline',
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 35,
  },
  detailsText: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    color: '#202020',
    lineHeight: 19,
  },
  linkedStatus: {
    width: 72,
    height: 18,
    borderRadius: 12,
    paddingTop: 3,
    paddingRight: 12,
    paddingBottom: 3,
    paddingLeft: 6,
    marginHorizontal: 10,
  },
  linkedStatusText: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 10,
    textAlign: 'center',
  },
});
