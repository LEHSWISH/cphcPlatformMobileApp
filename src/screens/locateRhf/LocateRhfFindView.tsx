import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Picker, {Item} from 'react-native-picker-select';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../styles';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import FullScreenLoader from '../../components/shared/FullScreenLoader';
import {
  DistrictAllResponseType,
  StateAllResponseType,
} from '../../interfaces/apiResponseTypes/RegionalHealthFacilityResponseTypes';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import LocateRhfAPI from '../../services/ApiHelpers/LocateRhfAPI';

type LocateRhfFindViewPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'LocateRhfFindView'
>;

const LocateRhfFindView = ({navigation}: LocateRhfFindViewPropTypes) => {
  const {t} = useTranslation();
  const isInitialDataLoadTriggered = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stateList, setStateList] = useState<StateAllResponseType | null>(null);
  const [cityList, setCityList] = useState<DistrictAllResponseType>([]);
  const dispatch = useAppDispatch();

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    !isInitialDataLoadTriggered.current &&
      !isLoading &&
      (() => {
        setIsLoading(true);
        isInitialDataLoadTriggered.current = true;
        LocateRhfAPI.getAllState()
          .then(res => {
            setStateList(res.data as StateAllResponseType);
          })
          .catch(() => {
            dispatch(
              setSnackBar({
                visible: true,
                message: t('common_error_messages.something_went_wrong'),
              }),
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      })();
  }, [dispatch, stateList, t, isLoading]);

  const stateListDropdownData = useMemo((): Item[] => {
    return (
      stateList?.map(el => ({
        value: el.stateCode,
        label: el.stateName,
        key: el.stateCode,
      })) || []
    );
  }, [stateList]);

  const cityListDropdownData = useMemo((): Item[] => {
    return (
      cityList?.map(el => ({
        key: el.districtCode,
        value: el.districtCode,
        label: el.districtName,
      })) || []
    );
  }, [cityList]);

  const handleStateChange = (stateCode: string) => {
    if (isLoading) {
      return;
    }
    setSelectedState(stateCode);
    setSelectedCity(null);
    setIsLoading(true);
    LocateRhfAPI.getDistrictList(stateCode)
      .then(r => {
        setCityList(r?.data);
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
  };

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.description}>
            {t('locate_RHF.description_1')}
          </Text>
          <View>
            <Text>
              {t('locate_RHF.state_label')}&nbsp;
              <Text style={styles.warn}>*</Text>
            </Text>
            <Picker
              style={{
                viewContainer: styles.inputPickerStyle,
                inputAndroid: styles.inputAndroid,
                inputIOS: styles.inputIOS,
              }}
              value={selectedState}
              placeholder={{
                label: t('locate_RHF.label_select_state'),
                value: null,
              }}
              onValueChange={handleStateChange}
              items={stateListDropdownData || []}
            />
          </View>
          <View>
            <Text>
              {t('locate_RHF.city_village_label')}&nbsp;
              <Text style={styles.warn}>*</Text>
            </Text>
            <Picker
              disabled={!cityList?.length}
              style={{
                viewContainer: styles.inputPickerStyle,
                inputAndroid: styles.inputAndroid,
                inputIOS: styles.inputIOS,
              }}
              value={selectedCity}
              placeholder={{
                label: t('locate_RHF.label_select_city'),
                value: null,
              }}
              onValueChange={setSelectedCity}
              items={cityListDropdownData || []}
            />
          </View>
          <Button
            onPress={() => {
              if (selectedCity && selectedState) {
                navigation.replace('RhfListView', {
                  districtCode: selectedCity,
                  stateCode: selectedState,
                });
              }
            }}
            disabled={!(selectedState && selectedCity)}
            mode="contained">
            {t('locate_RHF.button_label_search')}
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

export default LocateRhfFindView;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  description: {
    color: Colors.neutral.s500,
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontWeight: '500',
    width: '80%',
    alignSelf: 'center',
    paddingVertical: 15,
  },
  inputPickerStyle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral.s500,
    borderRadius: 5,
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        paddingVertical: 8,
        marginVertical: 5,
      },
    }),
  },
  inputAndroid: {color: Colors.neutral.s800},
  inputIOS: {color: Colors.neutral.s800},
  dropdownStyles: {elevation: 4},
  dropdownTextStyles: {color: Colors.neutral.s800},
  warn: {
    color: Colors.warning.asterisk,
  },
});
