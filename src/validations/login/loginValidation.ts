import * as Yup from 'yup';

export const usernameOrPhonenumberValidationSchema = Yup.object().shape({
  userNameOrPhoneNumber: Yup.string().required(
    'Please enter your username or phone number',
  ),
});

export const passwordValidationScheme = Yup.object().shape({
  password: Yup.string().required('Password is required'),
});

export const onBoardingScheme = Yup.object().shape({
  fullName: Yup.string().required('Please enter your full name.'),
});
