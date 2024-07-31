import * as Yup from 'yup';

export const signupValidationSchema = Yup.object().shape({
  userName: Yup.string()
    .required('Please enter your username.')
    .min(5, 'Must be of 5-20 characters')
    .max(20, 'Must be of 5-20 characters')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d).*$/,
      'Must contain at least one alphabet and one number',
    )
    .matches(
      /^[^\s!@#$%^&*()_+=[\]{};:'"\\|,.<>/?]*$/,
      'Must not contain any special characters or spaces',
    ),
  phoneNumber: Yup.string()
    .required('Please enter your phone number')
    .max(10, 'Please enter a valid 10 digit number')
    .min(10, 'Please enter a valid 10 digit number'),
  password: Yup.string().required('Password is required'),
});
