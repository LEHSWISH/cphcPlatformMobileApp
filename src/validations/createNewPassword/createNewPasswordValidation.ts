import * as Yup from 'yup';

export const passwordValidationScheme = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Must Contain 8 Characters')
    .required()
    .matches(/^(?=.*[a-z])/, ' Must Contain One Lowercase Character')
    .matches(/^(?=.*[A-Z])/, '  Must Contain One Uppercase Character')
    .matches(/^(?=.*[0-9])/, '  Must Contain One Number Character')
    .matches(
      /^(?=.*[!@#\$%\^&\*])/,
      '  Must Contain  One Special Case Character',
    ),
  confirmPassword: Yup.string()
    .required('please fill the confirm password field')
    .oneOf([Yup.ref('password'), ''], 'Passwords must match'),
});
