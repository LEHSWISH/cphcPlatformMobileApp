import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {View} from 'react-native-ui-lib';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Modal, Portal} from 'react-native-paper';
import {isAxiosError} from 'axios';
import {Colors} from '../../styles';
import LinkAbhaContinueButtonContainer from './LinkAbhaContinueButtonContainer';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import AbhaAddressList from '../../components/core/abhaAddressList/AbhaAddressList';
import LinkAbhaAPI, {
  LinkViaPhoneNumberVerifyOtpResponseType,
} from '../../services/ApiHelpers/LinkAbhaAPI';
import AppText from '../../components/shared/text/AppText';
import ButtonComponent from '../../components/shared/button/ButtonComponent';
import {AlertIcon} from '../../assets/images';
import {
  loadYatriAllData,
  setAbhaCardDetails,
} from '../../services/store/slices/yatriSlice';
import AbhaCreationAPI from '../../services/ApiHelpers/AbhaCreationAPI';

export interface LinkAbhaSelectAbhaAddressParamsType {
  idValue: string;
  accounts: LinkViaPhoneNumberVerifyOtpResponseType['accounts'];
  txnId: string;
  token: string;
}

type LinkAbhaSelectAbhaAddressPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'LinkAbhaSelectAbhaAddress'
>;

const LinkAbhaSelectAbhaAddress = ({
  route,
  navigation,
}: LinkAbhaSelectAbhaAddressPropTypes) => {
  const dispatch = useAppDispatch();
  const [selectedItem, setSelectedItem] = useState<number>();
  const [isShowConfirmationModal, setIsShowConfirmationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = route.params;
  const maskedIdValue = useMemo(() => {
    const shortenedId = params.idValue?.slice(-4) || '';
    return 'X'.repeat(10 - shortenedId?.length) + shortenedId;
  }, [params.idValue]);

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
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    await LinkAbhaAPI.linkViaPhoneNumberUserVerify({
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

  const handleOnContinue = useCallback(async () => {
    if (typeof selectedItem === 'number') {
      setIsShowConfirmationModal(true);
    }
  }, [selectedItem]);

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
            Select the ABHA address you want to link with this account
          </Text>
          <View style={styles.idContainer}>
            <Text style={styles.idText}>{'Phone number - '}</Text>
            <Text style={[styles.idText, styles.idValue]}>{maskedIdValue}</Text>
          </View>
          <AbhaAddressList
            listData={listData}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </View>
        <LinkAbhaContinueButtonContainer
          onPress={handleOnContinue}
          buttonLabel="Link"
        />
      </ScrollView>
      {isShowConfirmationModal && (
        <Portal>
          <Modal
            visible={true}
            contentContainerStyle={styles.modalContainerStyle}
            onDismiss={() => setIsShowConfirmationModal(false)}
            dismissableBackButton>
            <AlertIcon />
            <AppText customStyles={styles.modalTitle}>
              Confirmation required!
            </AppText>
            <AppText customStyles={styles.modalDescription}>
              Confirming will permanently link the selected ABHA account to
              YatriPulse and this action is irreversible.
            </AppText>
            <AppText customStyles={styles.modalDescription}>
              Do you wish to continue?
            </AppText>
            <ButtonComponent label="Confirm" onPress={handleOnConfirm} />
          </Modal>
        </Portal>
      )}
    </>
  );
};

export default LinkAbhaSelectAbhaAddress;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    alignItems: 'center',
    padding: 20,
    gap: 25,
  },
  idContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(51, 24, 159, 0.05)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  idText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
    color: Colors.variable.blackTextColor,
  },
  idValue: {
    color: 'rgba(51, 24, 159, 1)',
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
  modalContainerStyle: {
    backgroundColor: 'white',
    padding: 30,
    marginHorizontal: 20,
    width: '90%',
    borderRadius: 8,
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.textColor,
  },
  modalDescription: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
});
