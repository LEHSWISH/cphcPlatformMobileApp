import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import {Colors} from '../../styles';
import {TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import AppText from '../../components/shared/text/AppText';
import AbhaCreationAPI from '../../services/ApiHelpers/AbhaCreationAPI';
import {
  loadYatriAllData,
  setAbhaCardDetails,
} from '../../services/store/slices/yatriSlice';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {t} from 'i18next';
import {isAxiosError} from 'axios';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import FullScreenLoader from '../../components/shared/FullScreenLoader';

type CreateAbhaAddressPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'CreateAbhaAddress'
>;
const CreateAbhaAddress = ({navigation, route}: CreateAbhaAddressPropTypes) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState(['John_doe', 'John_doe_1']);
  const txdId = route?.params?.txnId;
  useEffect(() => {
    setIsLoading(true);
    AbhaCreationAPI.suggestionsApi({txnId: txdId})
      .then(response => {
        setSuggestions(response?.data?.abhaAddressList);
      })
      .catch(error => {
        let message = t('common_error_messages.something_went_wrong');
        if (isAxiosError(error) && error.response?.data?.message) {
          message = error.response?.data?.message;
        }
        dispatch(
          setSnackBar({
            message,
            visible: true,
          }),
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [txdId]);
  return (
    <>
      {isLoading && <FullScreenLoader />}
      <SafeAreaView style={styles.wrapper}>
        <Formik
          initialValues={{abhaAddress: ''}}
          onSubmit={values => {
            if (values.abhaAddress === '') {
              return;
            }
            let submissionAbhaAddress = values.abhaAddress;

            if (!submissionAbhaAddress.endsWith('@sbx')) {
              submissionAbhaAddress += '@sbx';
            }
            setIsLoading(true);
            AbhaCreationAPI.createAbhaAddress({
              abhaAddress: values.abhaAddress,
              preferred: 1,
              txnId: route?.params?.txnId,
            })
              .then(() => {
                setIsLoading(true);
                AbhaCreationAPI.fetchAbhaCard({
                  abhaToken: route?.params?.token || '',
                  authType: route?.params?.authType,
                  aadharNumber: route?.params?.aadhaarCardNumber,
                }).finally(() => {
                  setIsLoading(false);
                });
                AbhaCreationAPI.fetchAbhaCardPdf({
                  abhaToken: route?.params?.token || '',
                  authType: route?.params?.authType,
                  aadharNumber: route?.params?.aadhaarCardNumber,
                }).finally(() => {
                  setIsLoading(false);
                });
                dispatch(loadYatriAllData());
                dispatch(
                  setAbhaCardDetails({
                    abhaCardImage: route?.params?.response?.data?.preSignedUrl,
                    abhaCardPdfUrl: route?.params?.response?.data.preSignedUrl,
                    abhaNumber: route?.params?.response?.data.ABHANumber,
                  }),
                );
                navigation.popToTop();
                navigation.navigate('Abha');
              })
              .catch(error => {
                let message = t('common_error_messages.something_went_wrong');
                if (isAxiosError(error) && error.response?.data?.errorDetails) {
                  try {
                    const errorDetails = JSON.parse(
                      error.response?.data?.errorDetails,
                    );
                    message = errorDetails.error.message;
                  } catch (err) {
                    dispatch(
                      setSnackBar({
                        message: t(
                          'common_error_messages.something_went_wrong',
                        ),
                        visible: true,
                      }),
                    );
                  }
                } else if (
                  isAxiosError(error) &&
                  error.response?.data?.message
                ) {
                  message = error.response?.data?.message;
                }
                dispatch(
                  setSnackBar({
                    message,
                    visible: true,
                  }),
                );
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}>
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <>
              <View style={styles.sectionOne}>
                <Text style={styles.stepsStyle}>Step 3 of 3</Text>
                <Text style={styles.sectionDescription}>
                  ABHA address is a unique username that allows you to share and
                  access your health records digitally
                </Text>
                <View>
                  <TextInput
                    style={styles.formInputStyle}
                    label={
                      <Text>
                        ABHA address
                        <Text style={styles.asteriskStyle}> *</Text>
                      </Text>
                    }
                    mode="flat"
                    placeholder="Enter ABHA address"
                    value={values.abhaAddress}
                    onChangeText={handleChange('abhaAddress')}
                    right={<TextInput.Affix text="@abdm" />}
                  />
                  {errors?.abhaAddress && touched.abhaAddress ? (
                    <Text style={styles.errorText}>{errors?.abhaAddress}</Text>
                  ) : null}
                  <Text style={styles.suggestionText}>Suggestions:</Text>
                  <View style={styles.suggestionSection}>
                    {suggestions.slice(0, 4).map((suggestion, i) => {
                      return (
                        <React.Fragment key={i}>
                          <TouchableOpacity
                            style={styles.suggestionValueWrapper}
                            onPress={() => {
                              setFieldValue('abhaAddress', suggestion);
                            }}>
                            <AppText>{suggestion}</AppText>
                          </TouchableOpacity>
                        </React.Fragment>
                      );
                    })}
                  </View>
                </View>
              </View>
              <View style={styles.sectionTwo}>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() => {
                    handleSubmit();
                  }}>
                  <Text style={styles.continueButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </>
  );
};

export default CreateAbhaAddress;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  sectionOne: {
    flex: 0.8,
  },
  sectionTwo: {
    flex: 0.22,
  },
  stepsStyle: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    color: Colors.neutral.s500,
    paddingTop: 35,
  },
  sectionDescription: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    color: Colors.primary.textColor,
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  sectionDescriptionTwo: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    color: Colors.primary.textColor,
    paddingHorizontal: 15,
    paddingVertical: 40,
  },
  formInputStyle: {
    backgroundColor: '#fff',
    color: '#202020',
    margin: 12,
  },
  asteriskStyle: {
    color: Colors.warning.asterisk,
    fontSize: 16,
  },
  errorText: {
    color: Colors.warning.error,
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 10,
    paddingLeft: 25,
  },
  continueButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary.brand,
    borderRadius: 8,
    marginHorizontal: 35,
    marginVertical: 20,
    paddingHorizontal: 58,
    paddingVertical: 8,
  },
  continueButtonText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  suggestionText: {
    color: Colors.primary.brand,
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    padding: 20,
  },
  suggestionSection: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  suggestionValueWrapper: {
    borderWidth: 1,
    borderColor: Colors.neutral.borderColor,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
