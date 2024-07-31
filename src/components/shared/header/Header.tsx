import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, IconButton} from 'react-native-paper';
import {useAppSelector} from '../hooks/useAppSelector';

const Header = ({toggleDrawerToOpen}: HeaderPropType) => {
  const iconText = useAppSelector(
    s =>
      s.yatri.yatriAllDetails?.data?.yatriDetails?.fullName ||
      s.auth?.yatri?.userName ||
      '',
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDrawerToOpen}>
        <Avatar.Text
          size={36}
          label={iconText
            ?.split(' ')
            ?.map((el, i, arr) => {
              return i === 0 || i === arr.length - 1 ? el?.slice(0, 1) : '';
            })
            ?.join('')
            ?.toUpperCase()}
        />
      </TouchableOpacity>
      <IconButton
        icon="bell-outline"
        iconColor={'rgba(51, 24, 159, 1)'}
        size={24}
        onPress={() => {}}
      />
    </View>
  );
};

export default Header;

interface HeaderPropType {
  toggleDrawerToOpen: () => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
