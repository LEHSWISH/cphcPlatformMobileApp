import * as Yup from 'yup';

export const govtIdValidationSchema = Yup.object().shape({
  //   govtIdtype: Yup.string().required('Please select a government id.'),
  governmentId: Yup.string().required('Government Id value is required'),
});
