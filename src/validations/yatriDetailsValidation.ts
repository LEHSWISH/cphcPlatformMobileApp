import * as Yup from 'yup';

export const yatriDetailsValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Please enter your full name'),
  dob: Yup.string().required('Date of Birth is required'),
  tourStartDate: Yup.string().required('Tour start date is required'),
  tourEndDate: Yup.string().required('Tour end date is required'),
  phoneNumber: Yup.string()
    .required('Enter your phoneNumber')
    .length(10, 'enter the valid phoneNumber '),
  pincode: Yup.string()
    .required('Please enter your pincode')
    .length(6, 'Please enter valid pincode'),
});
