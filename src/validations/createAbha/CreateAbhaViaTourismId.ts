import * as Yup from 'yup';

export const tourismIdValidationScheme = Yup.object().shape({
  tourismId: Yup.string().required('Tourism Portal Id is required'),
});

export const aadhaarDetailsValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Enter Your Name'),
  dateOfBirth: Yup.date().required('Enter Your DOB'),
  aadhaarNumber: Yup.string().required('Please enter your Aadhaar number'),
  phoneNumber: Yup.string()
    .required('Please enter your phone number')
    .length(10, 'Phone number length should be 10 digits'),
  emailAddress: Yup.string().email('Enter your valid email address'),
  pincode: Yup.string().required('Please enter your pincode'),
  address: Yup.string().required('Please enter your address'),
});

export const addTourismPortalIdValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Enter Your Name'),
  dateOfBirth: Yup.date().required('Enter Your DOB'),
  phoneNumber: Yup.string()
    .required('Please enter your phone number')
    .length(10, 'Phone number length should be 10 digits'),
  emailAddress: Yup.string().email('Enter your valid email address'),
  pincode: Yup.string().required('Please enter your pincode'),
  address: Yup.string().required('Please enter your address'),
  tourStartDate: Yup.date().required('Enter your TourStart Date'),
  tourEndDate: Yup.date().required('Enter your TourEnd Date'),
});
