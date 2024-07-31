import React, {useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {useTranslation} from 'react-i18next';
import {useEffect, useRef, useState} from 'react';
import {useAppDispatch} from '../../components/shared/hooks/useAppDispatch';
import FullScreenLoader from '../../components/shared/FullScreenLoader';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Checkbox, Text} from 'react-native-paper';
import {Colors} from '../../styles';
import {useFormik} from 'formik';
import {setSnackBar} from '../../services/store/slices/helperSlice';
import MedicalDeclarationAPI from '../../services/ApiHelpers/MedicalDeclarationAPI';
import MedicalsReportsResponseType from '../../interfaces/apiResponseTypes/MedicalsReportsResponseType';

type MedicalDeclarationPropTypes = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'MedicalDeclaration'
>;

const initialValues: MedicalsReportsResponseType = {
  heartDisease: false,
  hypertension: false,
  respiratoryDiseaseOrAsthma: false,
  diabetesMellitus: false,
  tuberculosis: false,
  epilepsyOrAnyNeurologicalDisorder: false,
  kidneyOrUrinaryDisorder: false,
  cancer: false,
  migraineOrPersistentHeadache: false,
  anyAllergies: false,
  disorderOfTheJointsOrMusclesArthritisGout: false,
  anyMajorSurgery: false,
  noneOfTheAbove: true,
};

const MedicalDeclaration = ({navigation}: MedicalDeclarationPropTypes) => {
  const isInitialDataLoadedRef = useRef(false);
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const {handleSubmit, values, setValues} = useFormik({
    initialValues,
    onSubmit: () => {
      setIsLoading(true);
      MedicalDeclarationAPI.update(values)
        .then(() => {
          // navigation.navigate()
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
    },
  });

  useEffect(() => {
    !isInitialDataLoadedRef.current &&
      (() => {
        isInitialDataLoadedRef.current = true;
        MedicalDeclarationAPI.get()
          .then(response => {
            setValues(response?.data);
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
  }, [dispatch, setValues, t]);

  const handleOnValueChange = useCallback(
    (fieldName: string, fieldValue: boolean) => () => {
      if (fieldName === 'noneOfTheAbove') {
        const newValues: MedicalsReportsResponseType = {...values};
        let k: keyof MedicalsReportsResponseType;
        for (k in values) {
          newValues[k] = false;
        }
        newValues.noneOfTheAbove = !fieldValue;
        setValues(newValues, true);
      } else {
        setValues(
          {
            ...values,
            noneOfTheAbove: false,
            [fieldName]: !fieldValue,
          },
          true,
        );
      }
    },
    [setValues, values],
  );

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <View style={styles.container}>
        <Text style={styles.descriptionA}>
          Do you have an existing illness or medical history?
        </Text>
        <Text style={styles.descriptionB}>
          Please select the following if there is any. This will help us to
          ensure your smooth yatra.
        </Text>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange('heartDisease', values.heartDisease)}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={values.heartDisease ? 'checked' : 'unchecked'}
            />
            <Text style={styles.labelText}>Heart Disease or Cholesterol</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange('hypertension', values.hypertension)}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={values.hypertension ? 'checked' : 'unchecked'}
            />
            <Text style={styles.labelText}>Hypertension</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange(
              'respiratoryDiseaseOrAsthma',
              values.respiratoryDiseaseOrAsthma,
            )}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={
                values.respiratoryDiseaseOrAsthma ? 'checked' : 'unchecked'
              }
            />
            <Text style={styles.labelText}>Respiratory Disease or Asthma</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange(
              'diabetesMellitus',
              values.diabetesMellitus,
            )}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={values.diabetesMellitus ? 'checked' : 'unchecked'}
            />
            <Text style={styles.labelText}>Diabetes mellitus</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange('tuberculosis', values.tuberculosis)}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={values.tuberculosis ? 'checked' : 'unchecked'}
            />
            <Text style={styles.labelText}>Tuberculosis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange(
              'epilepsyOrAnyNeurologicalDisorder',
              values.epilepsyOrAnyNeurologicalDisorder,
            )}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={
                values.epilepsyOrAnyNeurologicalDisorder
                  ? 'checked'
                  : 'unchecked'
              }
            />
            <Text style={styles.labelText}>
              Epilepsy or any neurological disorder
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange(
              'kidneyOrUrinaryDisorder',
              values.kidneyOrUrinaryDisorder,
            )}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={values.kidneyOrUrinaryDisorder ? 'checked' : 'unchecked'}
            />
            <Text style={styles.labelText}>Kidney or urinary Disorder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange('cancer', values.cancer)}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={values.cancer ? 'checked' : 'unchecked'}
            />
            <Text style={styles.labelText}>Cancer (Any kind)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange(
              'migraineOrPersistentHeadache',
              values.migraineOrPersistentHeadache,
            )}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={
                values.migraineOrPersistentHeadache ? 'checked' : 'unchecked'
              }
            />
            <Text style={styles.labelText}>
              Migraine or persistent headache
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange('anyAllergies', values.anyAllergies)}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={values.anyAllergies ? 'checked' : 'unchecked'}
            />
            <Text style={styles.labelText}>Any Allergies</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange(
              'disorderOfTheJointsOrMusclesArthritisGout',
              values.disorderOfTheJointsOrMusclesArthritisGout,
            )}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={
                values.disorderOfTheJointsOrMusclesArthritisGout
                  ? 'checked'
                  : 'unchecked'
              }
            />
            <Text style={styles.labelText}>
              Disorder of the joints or muscles, arthritis, gout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange(
              'anyMajorSurgery',
              values.anyMajorSurgery,
            )}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={values.anyMajorSurgery ? 'checked' : 'unchecked'}
            />
            <Text style={styles.labelText}>Any Major Surgery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handleOnValueChange(
              'noneOfTheAbove',
              values.noneOfTheAbove,
            )}>
            <Checkbox.Android
              color={Colors.primary.brand}
              status={values.noneOfTheAbove ? 'checked' : 'unchecked'}
            />
            <Text style={styles.labelText}>None of the above</Text>
          </TouchableOpacity>
        </ScrollView>
        <Button
          onPress={() => handleSubmit()}
          mode="contained"
          style={styles.submitButton}>
          Save & Next
        </Button>
      </View>
    </>
  );
};

export default MedicalDeclaration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    gap: 18,
    padding: 24,
  },
  scrollViewContentContainer: {
    gap: 10,
  },
  descriptionA: {
    color: Colors.neutral.s500,
    fontFamily: 'Roboto',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    width: '100%',
    alignSelf: 'center',
  },
  descriptionB: {
    color: Colors.neutral.s500,
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 14,
    width: '100%',
    alignSelf: 'center',
  },
  rowItem: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(108, 105, 105, 0.2)',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 1,
  },
  labelText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.neutral.s800,
  },
  submitButton: {
    borderRadius: 8,
    backgroundColor: Colors.primary.brand,
  },
});
