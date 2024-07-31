const abhaImage = require('../../assets/images/abdmLogo.png');
// const medicalCertificate = require('../../assets/images/medicalCertificate.png');
// const locateMedicalFacility = require('../../assets/images/locateMedicalFacility.png');
// const vitalsImage = require('../../assets/images/vitals.png');
const uttarakhandTourismImage = require('../../assets/images/uttarakhandTourism.png');
const aadhar = require('../../assets/images/aadhaar.png');

const serviceCardData = (abhaNumber: string) => {
  return [
    {
      title: 'ABHA',
      subTitle: 'Ayushman Bharat Health Account',
      imageLogo: abhaImage,
      status: abhaNumber ? 'Linked' : 'Pending',
      navigateTo: abhaNumber ? 'Abha' : 'CreateAbhaNumber',
    },
    // {
    //   title: 'Locate Medical Facility',
    //   subTitle: 'Locate Medical Check-up Facility ',
    //   imageLogo: locateMedicalFacility,
    //   navigateTo: 'LocateRhfFindView',
    // },
    // {
    //   title: 'Medical Certificates',
    //   subTitle: 'Upload medical certificates',
    //   imageLogo: medicalCertificate,
    //   status: 'Linked',
    // },
    // {
    //   title: 'Vitals',
    //   subTitle:
    //     'Vitals will be reflected after completion of your check-up at the base center',
    //   imageLogo: vitalsImage,
    // },
  ];
};

export default serviceCardData;

export const abhaServiceCardData = [
  {
    title: 'Aadhaar',
    subTitle: 'Create your ABHA using Aadhaar',
    imageLogo: aadhar,
    navigateTo: 'EnterAadhar',
  },
  {
    title: 'Tourism Portal ID',
    subTitle: 'Create your ABHA using IDTP',
    imageLogo: uttarakhandTourismImage,
    navigateTo: 'CreateAbhaViaTourismId',
  },
];
