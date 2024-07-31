import {StyleSheet} from 'react-native';
import React, {useCallback} from 'react';
import {List, Avatar, Divider} from 'react-native-paper';
import {variable} from '../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppText from '../../shared/text/AppText';

interface AbhaAdressListPropType {
  listData: Array<{
    labelText: string;
    parimaryDescriptionText: string;
    secondaryDescriptionText: string;
    profilePhoto?: string;
  }>;
  selectedItem?: number;
  setSelectedItem: (state: number) => void;
}

const AbhaAddressList = ({
  listData,
  selectedItem,
  setSelectedItem,
}: AbhaAdressListPropType) => {
  const left = useCallback((item: (typeof listData)[number]) => {
    if (item.profilePhoto) {
      return () => (
        <Avatar.Image
          size={24}
          style={styles.avatar}
          source={{uri: `data:image/png;base64,${item.profilePhoto}`}}
        />
      );
    } else {
      return () => (
        <Avatar.Text
          size={24}
          label={item.labelText[0]}
          style={styles.avatar}
        />
      );
    }
  }, []);

  const right = useCallback(
    (index: number) => {
      return () =>
        selectedItem === index ? (
          <Icon name="check-circle" size={20} style={styles.checkIcon} />
        ) : null;
    },
    [selectedItem],
  );

  const title = useCallback((item: (typeof listData)[number]) => {
    return () => (
      <AppText customStyles={styles.itemName}>{item.labelText}</AppText>
    );
  }, []);

  const description = useCallback((item: (typeof listData)[number]) => {
    return () => (
      <>
        <AppText customStyles={styles.description}>
          {item.parimaryDescriptionText}
        </AppText>
        <AppText customStyles={styles.description}>
          {item.secondaryDescriptionText?.replaceAll('-', ' ')}
        </AppText>
      </>
    );
  }, []);

  return (
    <List.Section>
      {listData.map((item, index) => (
        <React.Fragment key={index}>
          <List.Item
            onPress={() => {
              setSelectedItem(index);
            }}
            style={[
              styles.listItem,
              selectedItem === index ? styles.selectedItem : null,
            ]}
            title={title(item)}
            description={description(item)}
            left={left(item)}
            right={right(index)}
          />
          <Divider style={styles.divider} />
        </React.Fragment>
      ))}
    </List.Section>
  );
};

export default AbhaAddressList;

const styles = StyleSheet.create({
  listItem: {
    width: 340,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  selectedItem: {
    borderWidth: 0.5,
    borderColor: variable.primary,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    color: variable.blackTextColor,
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
