const documentTypes = [
  {
    key: 'Aadhar Card',
    value: 'AADHAR_CARD',
    validationRegex: new RegExp('^[2-9]\\d{3}\\d{4}\\d{4}$'),
    invalidMessage: 'Invalid Aadhaar number. Please try again',
  },
  {
    key: 'PAN Card',
    value: 'PAN_CARD',
    validationRegex: new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
    invalidMessage: 'Invalid PAN card number. Please try again',
  },
  {
    key: 'Passport',
    value: 'PASSPORT',
    validationRegex: new RegExp('^[A-PR-WY-Z][1-9]\\d\\d{4}[1-9]$'),
    invalidMessage: 'Invalid Passport. Please try again',
  },
  {
    key: 'Voter ID Card',
    value: 'VOTER_ID_CARD',
    validationRegex: [
      new RegExp('^[A-Z]{3}\\d{7}$'),
      new RegExp('^[A-Z]{3}[0-9]{7}$'),
    ],
    invalidMessage: 'Invalid Voter ID number. Please try again',
  },
  {
    key: 'Driving License',
    value: 'DRIVING_LICENSE',
    validationRegex: new RegExp(
      '^(([A-Z]{2}[0-9]{2})|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$',
    ),
    invalidMessage: 'Invalid Driving License number. Please try again',
  },
];

export default documentTypes;
