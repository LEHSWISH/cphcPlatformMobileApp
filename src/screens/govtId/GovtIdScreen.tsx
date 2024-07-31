import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Picker from 'react-native-picker-select';
import {useTranslation} from 'react-i18next';
import {Colors} from '../../styles';
import documentTypes from '../../utils/constants/GovtIdDocument';
import {TextInput} from 'react-native-paper';
import {Formik} from 'formik';
import {govtIdValidationSchema} from '../../validations/govtIdValidations';
import {UpdateYartriDetailsPayloadType} from '../../interfaces/apiResponseTypes/ApiRequestPayoadTypes';
import HitApi from '../../classes/http/HitApi';
import {RequestMethod} from '../../enums/requestMethod/RequestMethod';
import {AuthorizationType} from '../../enums/authorization/AuthorizationType';
import {ApiEndpoints} from '../../enums/api/apiEndpointsEnum';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {useAppSelector} from '../../components/shared/hooks/useAppSelector';

const ScreenHeight = Dimensions.get('window').height;

// const list: Item[] = [1, 2, 3, 4];
const govtIdScreen = () => {
  const dispatch = useAppDispatch();
  const phoneNumber =
    useAppSelector(s => s.yatri.yatriAllDetails.data?.phoneNumber) || '';

  const [idValueErrorMessage, setIdValueErrorMessage] = useState<string>('');
  // const [idTypeErrorMessage, setIdTypeErrorMessage] = useState('');
  const govtIdTypeDropdownItem = documentTypes.map(el => ({
    value: el.value,
    label: el.key,
    key: el.key,
  }));

  // const govtIdTypeDropdownItem = useMemo(() => {
  //   documentTypes.map(el => ({
  //     value: el.value,
  //     label: el.key,
  //     key: el.key,
  //   }));
  // }, [documentTypes]);

  const handleOnBlur = (value: any) => {
    console.log(value, '##');
    if (value.governmentId === '') {
      console.log(
        `Please enter  ${value.governmentIdType.replace(/_/g, ' ')}  number`,
      );
    } else {
      const docInfo = documentTypes.find(
        item => item.value === value.governmentIdType,
      );
      if (docInfo && docInfo.validationRegex) {
        if (Array.isArray(docInfo.validationRegex)) {
          if (
            docInfo.validationRegex?.length &&
            !docInfo.validationRegex?.every(reg => {
              return reg.test(value.governmentId);
            })
          ) {
            setIdValueErrorMessage(docInfo.invalidMessage);
            console.log(docInfo.invalidMessage);

            return;
          }
        } else if (!docInfo.validationRegex.test(value.governmentId)) {
          setIdValueErrorMessage(docInfo.invalidMessage);
          console.log(docInfo.invalidMessage);
          return;
        }
      }
      console.log(docInfo, 'docInfo');
    }
  };
  const updateYatriDetailsApi = (payload: UpdateYartriDetailsPayloadType) => {
    return HitApi.hitapi({
      url: ApiEndpoints.YATRI_UPDATE_DETAILS_PATCH,
      requestMethod: RequestMethod.PATCH,
      payload,
      config: {
        authorization: AuthorizationType.BEARER_TOKEN,
      },
      sucessFunction: () => {
        dispatch(
          setSnackBar({
            visible: true,
            message: 'Government ID registered successfully.',
          }),
        );
      },
      errorFunction: (error: any) => {
        if (error?.data?.message) {
          dispatch(
            setSnackBar({
              visible: true,
              message: error?.data?.message,
            }),
          );
        } else {
          dispatch(
            setSnackBar({
              visible: true,
              message: t('common_error_messages.something_went_wrong'),
            }),
          );
        }
      },
    });
  };
  const {t} = useTranslation();
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView>
        <View style={{height: ScreenHeight * 0.6}}>
          <View style={styles.logo}>
            <Image
              style={{alignSelf: 'center'}}
              source={require('../../assets/images/uttarakhand.png')}
            />
            <Text style={[styles.alignCenter, styles.welcomeText]}>
              {t('govtId.description_message')}
            </Text>
          </View>
          <Formik
            validationSchema={govtIdValidationSchema}
            initialValues={{governmentIdType: '', governmentId: ''}}
            onSubmit={values => {
              if (idValueErrorMessage) {
                console.log(values);
                // updating the yatri details by adding the government id
                // updateYatriDetailsApi({
                //   ...values,
                //   phoneNumber,
                // });
              }
            }}>
            {({handleChange, handleSubmit, values, errors, setFieldValue}) => (
              <View>
                <Text>
                  {t('govtId.govt_id_type')}&nbsp;
                  <Text style={styles.warn}>*</Text>
                </Text>
                <Picker
                  style={{
                    viewContainer: styles.inputPickerStyle,
                    inputAndroid: styles.inputAndroid,
                    inputIOS: styles.inputIOS,
                  }}
                  placeholder={{
                    label: t('govtId.label_select_govt_id'),
                    value: null,
                  }}
                  value={values.governmentIdType}
                  onValueChange={value => {
                    setFieldValue('governmentIdType', value);
                  }}
                  items={govtIdTypeDropdownItem}
                />
                {errors?.governmentIdType && (
                  <Text style={styles.errorText}>
                    {errors?.governmentIdType}
                  </Text>
                )}
                <View style={styles.govtIdInput}>
                  <Text>
                    {t('govtId.govt_id')}
                    <Text style={{color: '#C7413A', fontSize: 16}}> *</Text>
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: '#fff',
                      color: '#202020',
                    }}
                    mode="flat"
                    placeholder="Enter your goernment ID"
                    onBlur={handleOnBlur(values)}
                    value={values.governmentId}
                    onChangeText={handleChange('governmentId')}
                    error={!!idValueErrorMessage || !!errors.governmentId}
                  />
                  {errors?.governmentId ? (
                    <Text style={styles.errorText}>{errors?.governmentId}</Text>
                  ) : idValueErrorMessage ? (
                    <Text style={styles.errorText}>{idValueErrorMessage}</Text>
                  ) : (
                    ''
                  )}
                </View>
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => {
                    handleSubmit();
                  }}>
                  <Text style={styles.ctaButtonText}>
                    {t('common_action_text.submit')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
  },
  alignCenter: {
    textAlign: 'center',
  },
  welcomeText: {
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '600',
    color: '#202020',
  },
  inputPickerStyle: {
    fontSize: 14,
    fontWeight: '500',
    // color: Colors.neutral.s500,
    color: 'red',
    borderRadius: 5,
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        paddingVertical: 8,
        marginVertical: 5,
      },
    }),
  },
  warn: {
    color: Colors.warning.asterisk,
  },
  inputAndroid: {color: Colors.neutral.s800},
  inputIOS: {color: Colors.neutral.s800},
  // inputIOS: {color: 'red'},
  govtIdInput: {
    paddingVertical: 12,
  },
  ctaButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#33189F',
    borderRadius: 8,
    margin: 35,
    paddingHorizontal: 58,
    paddingVertical: 8,
  },
  ctaButtonText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    color: '#C7413A',
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 10,
    paddingLeft: 15,
  },
});

export default govtIdScreen;
