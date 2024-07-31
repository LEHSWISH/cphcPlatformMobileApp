import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {View} from 'react-native-ui-lib';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {isAxiosError} from 'axios';
import {Colors} from '../../styles';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import AbhaAddressList from '../../components/core/abhaAddressList/AbhaAddressList';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import {
  loadYatriAllData,
  setAbhaCardDetails,
} from '../../services/store/slices/yatriSlice';
import AbhaCreationAPI from '../../services/ApiHelpers/AbhaCreationAPI';
import RecoverAbhaAPI, {
  RecoverAbhaGenerateMobileOtpApiResponseType,
} from '../../services/ApiHelpers/RecoverAbhaAPI';

export interface RecoverAbhaSelectAbhaAddressParamsType {
  idValue: string;
  accounts: RecoverAbhaGenerateMobileOtpApiResponseType['accounts'];
  txnId: string;
  token: string;
}

type RecoverAbhaSelectAbhaAddressPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'RecoverAbhaSelectAbhaAddress'
>;

const RecoverAbhaSelectAbhaAddress = ({
  route,
  navigation,
}: RecoverAbhaSelectAbhaAddressPropTypes) => {
  const dispatch = useAppDispatch();
  const [selectedItem, setSelectedItem] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const params = route.params;

  const errorCatch = useCallback(
    (err: unknown) => {
      let message = 'Something went wrong, Please try again';
      if (isAxiosError(err) && err.response?.data?.errorDetails) {
        if (typeof err.response?.data?.errorDetails === 'string') {
          try {
            const errorDetails = JSON.parse(err.response?.data?.errorDetails);
            message = errorDetails.error.message;
          } catch (_error) {}
        } else {
          message = err.response.data.errorDetails.message;
        }
      } else if (isAxiosError(err) && err.response?.data?.message) {
        message = err.response?.data?.message;
      }
      dispatch(
        setSnackBar({
          visible: true,
          message,
        }),
      );
    },
    [dispatch],
  );

  const fetchAbhaCardFlow = useCallback(
    ({
      token,
      authType,
      aadharNumber,
    }: {
      token: string;
      authType: string;
      aadharNumber: string;
    }) => {
      AbhaCreationAPI.fetchAbhaCard({
        abhaToken: token,
        authType: authType,
        aadharNumber: aadharNumber,
      })
        .then(() => {})
        .catch(() => {});

      AbhaCreationAPI.fetchAbhaCardPdf({
        abhaToken: token,
        authType: authType,
        aadharNumber: aadharNumber,
      })
        .then(() => {})
        .catch(() => {});
    },
    [],
  );

  const handleOnConfirm = useCallback(async () => {
    if (isLoading || typeof selectedItem !== 'number') {
      return;
    }
    setIsLoading(true);
    await RecoverAbhaAPI.verifyUser({
      ABHANumber: params.accounts[selectedItem!].ABHANumber,
      abhaToken: params.token,
      txnId: params.txnId,
    })
      .then(response => {
        dispatch(
          setSnackBar({
            visible: true,
            message: 'ABHA linked successfully!',
          }),
        );
        fetchAbhaCardFlow({
          token: response.data.tokens?.token || '',
          authType: response.data.authType!,
          aadharNumber: '',
        });
        dispatch(
          setAbhaCardDetails({
            abhaCardImage: response.data.preSignedUrl,
            abhaCardPdfUrl: response.data.preSignedUrl,
            abhaNumber: response.data.ABHANumber,
          }),
        );
        dispatch(loadYatriAllData());
        navigation.popToTop();
        navigation.navigate('Abha');
      })
      .catch(errorCatch);
  }, [
    dispatch,
    errorCatch,
    fetchAbhaCardFlow,
    isLoading,
    navigation,
    params,
    selectedItem,
  ]);

  const listData = useMemo(
    () =>
      params.accounts.map(item => ({
        labelText: item.name,
        parimaryDescriptionText: item.preferredAbhaAddress,
        secondaryDescriptionText: item.ABHANumber,
        profilePhoto: item.profilePhoto,
      })),
    [params.accounts],
  );

  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContent}>
          <Text style={styles.description}>
            Select the ABHA account you want to recover
          </Text>
          <AbhaAddressList
            listData={listData}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </View>
        <ButtonComponent onPress={handleOnConfirm} label="Recover" />
      </ScrollView>
    </>
  );
};

export default RecoverAbhaSelectAbhaAddress;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    alignItems: 'center',
    padding: 20,
    gap: 25,
  },
  formContent: {
    alignItems: 'center',
    flexGrow: 1,
    gap: 20,
  },
  description: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
  },
});
