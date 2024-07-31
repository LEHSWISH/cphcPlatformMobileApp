import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {View} from 'react-native-ui-lib';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {isAxiosError} from 'axios';
import {Colors} from '../../styles';
import LinkAbhaContinueButtonContainer from './LinkAbhaContinueButtonContainer';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {LinkAbhaMethodEnum} from './LinkAbhaMethodSelection';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import LinkAbhaAPI from '../../services/ApiHelpers/LinkAbhaAPI';

export enum LinkAbhaSelectOtpMethodSelectionEnum {
  AADHAAR = 'aadhaar',
  ABHA = 'abha',
}

export interface LinkAbhaSelectOtpMethodParamsType {
  linkAbhaMethod: LinkAbhaMethodEnum;
  idLabel: string;
  idValue: string;
  description: string;
}

type LinkAbhaSelectOtpMethodPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'LinkAbhaSelectOtpMethod'
>;

const LinkAbhaSelectOtpMethod = ({
  route,
  navigation,
}: LinkAbhaSelectOtpMethodPropTypes) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {
    params: {description, idLabel, idValue, linkAbhaMethod},
  } = route;

  const [selectedRoute, setSelectedRoute] =
    useState<LinkAbhaSelectOtpMethodSelectionEnum>(
      LinkAbhaSelectOtpMethodSelectionEnum.AADHAAR,
    );

  const errorCatch = useCallback(
    (err: unknown) => {
      let message = 'Something went wrong, Please try again';
      if (isAxiosError(err) && err.response?.data?.errorDetails) {
        try {
          const errorDetails = JSON.parse(err.response?.data?.errorDetails);
          message = errorDetails.error
            ? errorDetails.error.message
            : errorDetails.message;
        } catch (_error) {}
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

  const handleOnContinue = useCallback(async () => {
    if (isLoading) {
      return;
    }
    if (linkAbhaMethod === LinkAbhaMethodEnum.ABHA_NUMBER) {
      if (selectedRoute === LinkAbhaSelectOtpMethodSelectionEnum.AADHAAR) {
        setIsLoading(true);
        await LinkAbhaAPI.linkViaAbhaNumberRequestOtpViaAadhaar({
          ABHANumber: idValue,
        })
          .then(res => {
            navigation.navigate('LinkAbhaOtpVerification', {
              aadhaarNumber: null,
              ABHANumber: res.data.ABHANumber || idValue,
              AbhaAdress: null,
              authType: res.data.authType!,
              linkAbhaMethod,
              linkAbhaOtpRouteSelection: selectedRoute,
              message: res.data.message,
              token: res.data.tokens?.token!,
              txnId: res.data.txnId,
              phoneNumber: null,
            });
          })
          .catch(errorCatch)
          .finally(() => setIsLoading(false));
      } else if (selectedRoute === LinkAbhaSelectOtpMethodSelectionEnum.ABHA) {
        setIsLoading(true);
        await LinkAbhaAPI.linkViaAbhaNumberRequestOtpViaAbha({
          ABHANumber: idValue,
        })
          .then(res => {
            navigation.navigate('LinkAbhaOtpVerification', {
              aadhaarNumber: null,
              ABHANumber: res.data.ABHANumber || idValue,
              AbhaAdress: null,
              authType: res.data.authType!,
              linkAbhaMethod,
              linkAbhaOtpRouteSelection: selectedRoute,
              message: res.data.message,
              token: res.data.tokens?.token!,
              txnId: res.data.txnId,
              phoneNumber: null,
            });
          })
          .catch(errorCatch)
          .finally(() => setIsLoading(false));
      }
    } else if (linkAbhaMethod === LinkAbhaMethodEnum.ABHA_ADDRESS) {
      if (selectedRoute === LinkAbhaSelectOtpMethodSelectionEnum.AADHAAR) {
        setIsLoading(true);
        await LinkAbhaAPI.linkViaAbhaAddressRequestOtpViaAadhar({
          healthid: idValue,
        })
          .then(res => {
            navigation.navigate('LinkAbhaOtpVerification', {
              aadhaarNumber: null,
              ABHANumber: res.data.ABHANumber,
              AbhaAdress: idValue,
              authType: res.data.authType!,
              linkAbhaMethod,
              linkAbhaOtpRouteSelection: selectedRoute,
              message: res.data.message,
              token: res.data.tokens?.token!,
              txnId: res.data.txnId,
              phoneNumber: null,
            });
          })
          .catch(errorCatch)
          .finally(() => setIsLoading(false));
      } else if (selectedRoute === LinkAbhaSelectOtpMethodSelectionEnum.ABHA) {
        setIsLoading(true);
        await LinkAbhaAPI.linkViaAbhaAddressRequestOtpViaAbha({
          healthid: idValue,
        })
          .then(res => {
            navigation.navigate('LinkAbhaOtpVerification', {
              aadhaarNumber: null,
              ABHANumber: res.data.ABHANumber,
              AbhaAdress: idValue,
              authType: res.data.authType!,
              linkAbhaMethod,
              linkAbhaOtpRouteSelection: selectedRoute,
              message: res.data.message,
              token: res.data.tokens?.token!,
              txnId: res.data.txnId,
              phoneNumber: null,
            });
          })
          .catch(errorCatch)
          .finally(() => setIsLoading(false));
      }
    }
  }, [
    errorCatch,
    idValue,
    isLoading,
    linkAbhaMethod,
    navigation,
    selectedRoute,
  ]);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.idContainer}>
        <Text style={styles.idText}>
          {idLabel}
          {' - '}
        </Text>
        <Text style={[styles.idText, styles.idValue]}>{idValue}</Text>
      </View>
      <View style={styles.formContent}>
        <Text style={styles.description}>{description}</Text>
        <RadioButton.Group
          onValueChange={newValue => {
            setSelectedRoute(newValue as LinkAbhaSelectOtpMethodSelectionEnum);
          }}
          value={selectedRoute}>
          <View style={styles.radioGroup}>
            <View style={styles.radioButtonItem}>
              <RadioButton.Android
                value={LinkAbhaSelectOtpMethodSelectionEnum.AADHAAR}
              />
              <Text style={styles.radioLabel}>Aadhaar</Text>
            </View>
            <View style={styles.radioButtonItem}>
              <RadioButton.Android
                value={LinkAbhaSelectOtpMethodSelectionEnum.ABHA}
              />
              <Text style={styles.radioLabel}>ABHA</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>
      <LinkAbhaContinueButtonContainer onPress={handleOnContinue} />
    </ScrollView>
  );
};

export default LinkAbhaSelectOtpMethod;

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
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 35,
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.variable.descriptionText,
  },
});
