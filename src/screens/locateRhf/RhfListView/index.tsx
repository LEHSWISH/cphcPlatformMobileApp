import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet, View} from 'react-native';
import {Divider, Text, TextInput} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../../styles';
import {useAppDispatch} from '../../../components/shared/hooks/useAppDispatch';
import FullScreenLoader from '../../../components/shared/FullScreenLoader';
import {setSnackBar} from '../../../services/store/slices/helperSlice';
import LocateRhfAPI from '../../../services/ApiHelpers/LocateRhfAPI';
import {
  RhfFacilityListType,
  RhfFacilityType,
} from '../../../interfaces/apiResponseTypes/RegionalHealthFacilityResponseTypes';
import {HomeFragmentStackParamList} from '../../../navigation/stack/HomeFragmentStack';
import ListItem from './ListsItem';

const ListEmptyComponent = () => {
  const {t} = useTranslation();
  return <Text>{t('common_error_messages.no_content_to_display')}</Text>;
};
const ItemSeparatorComponent = () => <Divider style={styles.itemDivider} />;

type RhfListViewPropsType = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'RhfListView'
>;

const RhfListView = ({route}: RhfListViewPropsType) => {
  const {t} = useTranslation();
  const isInitialDataLoadTriggered = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const [facilityList, setFacilityList] = useState<RhfFacilityListType | null>(
    null,
  );
  const [searchText, setSearchText] = useState('');
  const [filteredFaciltyList, setFilteredFacilityList] =
    useState<RhfFacilityListType>([]);
  const timeOutId = useRef<NodeJS.Timeout>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    !isInitialDataLoadTriggered.current &&
      !isLoading &&
      (() => {
        setIsLoading(true);
        isInitialDataLoadTriggered.current = true;
        if (isLoading) {
          return;
        }
        LocateRhfAPI.getRhfFacilityList({
          stateCode: route?.params?.stateCode,
          districtCode: route?.params?.districtCode,
        })
          .then(r => {
            setFacilityList(r?.data);
          })
          .catch(() => {
            dispatch(
              setSnackBar({
                visible: true,
                message: t('common_error_messages.something_went_wrong'),
              }),
            );
          })
          .finally(() => setIsLoading(false));
      })();
  }, [dispatch, t, isLoading, route.params]);

  useEffect(() => {
    setSearchText('');
  }, [facilityList]);

  useEffect(() => {
    timeOutId.current = setTimeout(() => {
      if (!searchText) {
        setFilteredFacilityList(facilityList || []);
      } else {
        const lText = searchText?.toLowerCase();
        setFilteredFacilityList(
          (facilityList &&
            facilityList.filter(
              i =>
                i.facilityName?.toLowerCase()?.includes(lText) ||
                i.facilityId?.toLowerCase()?.includes(lText) ||
                `${i.abdmEnabled}`?.toLowerCase()?.includes(lText) ||
                i.facilityType?.toLowerCase()?.includes(lText) ||
                i.facilityStatus?.toLowerCase()?.includes(lText) ||
                i.ownership?.toLowerCase()?.includes(lText) ||
                i.address?.toLowerCase()?.includes(lText),
            )) ||
            [],
        );
      }
    }, 300);
    return () => {
      clearInterval(timeOutId.current);
    };
  }, [facilityList, searchText]);

  useEffect(() => {
    return () => {
      clearInterval(timeOutId.current);
    };
  }, []);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<RhfFacilityType>) => {
      return <ListItem item={item} />;
    },
    [],
  );

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <View style={styles.container}>
        <TextInput
          onChangeText={setSearchText}
          value={searchText}
          label={t('locate_RHF.label_search')}
          mode="outlined"
          left={<TextInput.Icon icon="magnify" />}
        />
        <Text style={styles.description}>{t('locate_RHF.description_2')}</Text>
        <Divider />
        <FlatList
          style={styles.scrollView}
          data={filteredFaciltyList}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          keyExtractor={item => item.facilityId + item.facilityName}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      </View>
    </>
  );
};

export default RhfListView;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.neutral.white,
    flex: 1,
    padding: 24,
    gap: 10,
  },
  description: {
    fontFamily: 'Roboto-Bold',
    color: Colors.neutral.s500,
    fontSize: 18,
  },
  itemDivider: {marginVertical: 5},
});
