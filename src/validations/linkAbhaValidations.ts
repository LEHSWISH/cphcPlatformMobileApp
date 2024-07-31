import * as Yup from 'yup';
import {LinkAbhaMethodEnum} from '../screens/linkAbha/LinkAbhaMethodSelection';

export const validationSchemaLinkAbhaMethodSelection = Yup.object().shape({
  selectedMethod: Yup.string(),
  [LinkAbhaMethodEnum.PHONE]: Yup.string().when('selectedMethod', {
    is: (value: string) => value === LinkAbhaMethodEnum.PHONE,
    then: schema =>
      schema
        .required('Phone number is a required field')
        .length(10, 'Please enter a valid Phone number')
        .matches(/^[6-9]/, 'Please enter a valid Phone number'),
  }),
  [LinkAbhaMethodEnum.ABHA_NUMBER]: Yup.string().when('selectedMethod', {
    is: (value: string) => value === LinkAbhaMethodEnum.ABHA_NUMBER,
    then: schema =>
      schema
        .required('ABHA number is a required field')
        .length(17, 'Please enter a valid ABHA number')
        .matches(
          /^\d{2}-\d{4}-\d{4}-\d{4}$/,
          'Please follow this format: XX-XXXX-XXXX-XXXX',
        ),
  }),
  [LinkAbhaMethodEnum.AADHAAR_NUMBER]: Yup.string().when('selectedMethod', {
    is: (value: string) => value === LinkAbhaMethodEnum.AADHAAR_NUMBER,
    then: schema =>
      schema
        .required('Aadhaar number is a required field')
        .length(12, 'Please enter a valid Aadhaar number'),
  }),
  [LinkAbhaMethodEnum.ABHA_ADDRESS]: Yup.string().when('selectedMethod', {
    is: (value: string) => value === LinkAbhaMethodEnum.ABHA_ADDRESS,
    then: schema =>
      schema
        .required('ABHA address is a required field')
        .length(13, 'Please enter a valid ABHA address'),
  }),
});
