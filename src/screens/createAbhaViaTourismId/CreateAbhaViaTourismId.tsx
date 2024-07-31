import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {isAxiosError} from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Formik, FormikProps} from 'formik';
import {TextInput} from 'react-native-paper';
import CreateAbhaApi from '../../services/ApiHelpers/CreateAbhaApi';
import {tourismIdValidationScheme} from '../../validations/createAbha/CreateAbhaViaTourismId';
import {Colors} from '../../styles';
import {useAppSelector} from '../../components/shared/hooks/useAppSelector';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import {neutral, primary, variable} from '../../styles/colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';

const initialValues = {
  tourismId: '',
};

type CreateViaTourismIdPropType = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'CreateAbhaViaTourismId'
>;
const CreateViaTourismId = ({navigation}: CreateViaTourismIdPropType) => {
  const [isLoading, setIsLoading] = useState(false);
  const formikRef = React.useRef<FormikProps<typeof initialValues>>(null);
  const idtpId = useAppSelector(
    s => s.yatri.yatriAllDetails.data?.tourismUserInfo?.idtpId,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (idtpId?.length && !formikRef.current?.values.tourismId) {
      formikRef.current?.setFieldValue('tourismId', idtpId);
    }
  }, [idtpId]);
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.flexItem}>
        <View style={styles.flexItem}>
          <View style={[styles.logo]}>
            <Text style={[styles.alignCenter, styles.tourismIdDescription]}>
              Enter Tourism Portal ID to Generate ABHA Number
            </Text>
          </View>
          <Formik
            validationSchema={tourismIdValidationScheme}
            initialValues={initialValues}
            innerRef={formikRef}
            onSubmit={values => {
              if (isLoading) {
                return;
              }
              setIsLoading(true);
              let payload = {
                tourismPortalId: values.tourismId,
              };
              CreateAbhaApi.IdtpGetUserInfoApi(payload)
                .then(res => {
                  navigation.navigate('CreateAbhaByTourismPortalIDFormTwo', {
                    response: res.data,
                  });
                })
                .catch(err => {
                  let message = 'Something went wrong, Please try again';
                  if (isAxiosError(err) && err.response?.data?.message) {
                    message = err.response?.data?.message;
                  }
                  dispatch(
                    setSnackBar({
                      visible: true,
                      message,
                    }),
                  );
                })
                .finally(() => setIsLoading(false));
            }}>
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
              handleBlur,
            }) => (
              <View style={styles.flexItem}>
                <TextInput
                  style={styles.formikInpLabel}
                  disabled={isLoading || !!idtpId?.length}
                  label={
                    <Text>
                      Tourism Portal Number
                      <Text style={styles.asTerix}> *</Text>
                    </Text>
                  }
                  mode="flat"
                  placeholder="Enter your Tourism Portal ID"
                  value={values.tourismId}
                  onBlur={handleBlur('tourismId')}
                  onChangeText={handleChange('tourismId')}
                />
                {errors?.tourismId && touched.tourismId ? (
                  <Text style={styles.errorText}>{errors?.tourismId}</Text>
                ) : (
                  ''
                )}

                {/*  No Modal Present in figma need clarity from project
                 <TouchableOpacity
                  onPress={() => {}}
                  style={styles.findTourismId}>
                  <Icon
                    name="information-outline"
                    size={20}
                    style={styles.findTourismIdImage}
                  />
                  <Text style={styles.findTourismIdText}>
                    Where to find registration ID for tourism portal?
                  </Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() => {
                    handleSubmit();
                  }}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateViaTourismId;

const styles = StyleSheet.create({
  flexItem: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: neutral.white,
  },
  alignCenter: {
    textAlign: 'center',
  },
  tourismIdDescription: {
    fontFamily: 'Roboto',
    fontSize: 16,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    marginVertical: 26,
    fontWeight: '500',
    color: variable.blackTextColor,
  },
  formikInpLabel: {
    backgroundColor: neutral.white,
    color: variable.blackTextColor,
    margin: 12,
  },
  asTerix: {
    color: variable.danger,
    fontSize: 16,
  },
  textButton: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    color: variable.primary,
    textDecorationLine: 'underline',
    marginHorizontal: 20,
  },
  continueButton: {
    backgroundColor: variable.primary,
    borderRadius: 8,
    margin: 35,
    paddingHorizontal: 58,
    paddingVertical: 8,
    marginTop: 'auto',
  },
  continueButtonText: {
    fontFamily: 'Roboto',
    color: neutral.white,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  findTourismId: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  findTourismIdImage: {
    color: Colors.primary.brand,
    paddingRight: 5,
  },
  findTourismIdText: {
    fontSize: 12,
    color: primary.brand,
    fontWeight: '500',
  },
  errorText: {
    color: variable.danger,
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 10,
    paddingLeft: 25,
  },
  logo: {
    justifyContent: 'center',
  },
  passwordCheckerDescription: {
    paddingHorizontal: 20,
  },
});
