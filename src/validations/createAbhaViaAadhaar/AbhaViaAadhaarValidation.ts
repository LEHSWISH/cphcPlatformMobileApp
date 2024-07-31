import * as Yup from 'yup';

export const aadharNumberValidationSchema = Yup.object().shape({
  aadharNumber: Yup.string()
    .required('Please enter your aadhaar number')
    .min(12, 'Please a enter a valid 12 digit number')
    .max(12, 'Please a enter a valid 12 digit number'),
});

export const aadharAuthenticationValidaionSchema = Yup.object().shape({
  otp: Yup.string().required('Please enter your OTP'),
  phoneNumber: Yup.string().required('Phone number is required'),
});

export const abhaCommunicationOtpValidationScheme = Yup.object().shape({
  abhaCommunicationOtp: Yup.string().required('Please enter your OTP'),
});
