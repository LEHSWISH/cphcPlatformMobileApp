import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {List, Avatar, Divider} from 'react-native-paper';
import {variable} from '../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppText from '../../shared/text/AppText';

const UserList = ({data, navigation}: any) => {
  const left = useCallback(item => {
    return () => (
      <Avatar.Text
        size={24}
        label={item[0].toUpperCase()}
        style={styles.avatar}
      />
    );
  }, []);
  const right = useCallback((selectedUser, item) => {
    return () =>
      selectedUser === item ? (
        <Icon name="check-circle" size={20} style={styles.checkIcon} />
      ) : null;
  }, []);
  const title = useCallback(item => {
    return () => <AppText customStyles={styles.itemName}>{item}</AppText>;
  }, []);
  const [selectedUser, setSelectedUser] = useState<string>('');
  return (
    <View>
      <List.Section>
        {data?.map((item, index) => (
          <React.Fragment key={index}>
            <List.Item
              onPress={() => {
                setSelectedUser(item);
                navigation.navigate('StepThreeLoginPassword', {userName: item});
              }}
              style={[
                styles.listItem,
                selectedUser === item ? styles.selectedUser : null,
              ]}
              title={title(item)}
              left={left(item)}
              right={right(selectedUser, item)}
            />
            <Divider style={styles.divider} />
          </React.Fragment>
        ))}
      </List.Section>
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  listItem: {
    width: 340,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  selectedUser: {
    borderWidth: 0.5,
    borderColor: variable.primary,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  avatar: {
    backgroundColor: variable.primary,
  },
  checkIcon: {
    alignSelf: 'center',
    color: variable.primary,
  },
  divider: {
    marginTop: 8,
  },
});
