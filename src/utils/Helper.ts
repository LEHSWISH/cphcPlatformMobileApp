import CryptoJS from 'crypto-js';
import RNFetchBlob from 'rn-fetch-blob';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';

export const getFullDate = (input: Date) => {
  let date = input.getDate().toLocaleString();
  let month = input.getMonth() + 1;
  let year = input.getFullYear();
  return [date, month, year].join('/');
};

export const encryption = (dataToBeEncrypted: string) => {
  // key and iv values should be  same as present in backend
  const key = CryptoJS.enc.Latin1.parse('v#N/R1V]5z1Nb%|7');
  const iv = CryptoJS.enc.Latin1.parse('aN[6|3s-O29x_n:c');
  const encryptedData = CryptoJS.AES.encrypt(dataToBeEncrypted, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return encryptedData;
};

export const decryption = (encryptedData: string) => {
  // key and iv values should be same as present in the backend
  // key and iv values should be same as present in the backend
  const key = CryptoJS.enc.Latin1.parse('Wishfoundation24');
  const iv = CryptoJS.enc.Latin1.parse('Wishfoundation95');

  // Decrypt
  let decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  // Convert the decrypted bytes to plaintext
  const decryptedUsername = decryptedBytes.toString(CryptoJS.enc.Utf8);

  return decryptedUsername;
};

export const prepareToDownload = async (fileUrl: string | null) => {
  // Function to check the platform
  // If Platform is Android then check for permissions.

  if (Platform.OS === 'ios') {
    downloadFile(fileUrl);
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'Application needs access to your storage to download File',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
          buttonNeutral: '',
        },
      );
      console.log(granted, PermissionsAndroid.RESULTS.GRANTED);

      // for android version < 6.0
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Start downloading
        downloadFile(fileUrl);
      } else {
        // for android version < 6.0
        const checkPermision = await checkAndroidStoragePermsion();
        // downloadFile(fileUrl);
        if (checkPermision === 'granted') {
          downloadFile(fileUrl);
        } else {
          requestAndroidStoragePermsion();
          // Alert.alert('Error', 'Storage Permission Not Granted');
        }
      }
    } catch (err) {
      // To handle permission related exception
      console.log('++++' + err);
    }
  }
};

const downloadFile = (fileUrl: string | null) => {
  // Get today's date to add the time suffix in filename
  let date = new Date();
  // File URL which we want to download
  if (fileUrl) {
    let FILE_URL = fileUrl;
    // Function to get extention of the file url
    let file_ext: any = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];
    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
      useDownloadManager: true,
      notification: true,
      path:
        RootDir +
        '/file_' +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        file_ext,
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        if (Platform.OS === 'ios') {
          RNFetchBlob.fs.writeFile(options.path, res.data, 'base64');
          RNFetchBlob.ios.previewDocument(options.path);
        }
        if (Platform.OS === 'android') {
          console.log('file downloaded in android');
        }
        // Alert after successful downloading
        Alert.alert('File Downloaded Successfully.', ' ', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'OK'},
        ]);
      });
  }
};

const getFileExtention = (fileUrl: string) => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};
export function convertAadharCardNumber(data: string) {
  // key and iv values should be  same as present in backend
  const key = CryptoJS.enc.Latin1.parse('Wishfoundation24');
  const iv = CryptoJS.enc.Latin1.parse('Wishfoundation95');
  const encryptedAadharNumber = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return encryptedAadharNumber;
}

export function durationInDays(a: Date, b: Date) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  const differenceMilliseconds = Math.abs(utc2 - utc1);
  const durationDays = Math.ceil(differenceMilliseconds / millisecondsPerDay);
  return durationDays;
}
export function formatDate(isoDate: string) {
  const date = new Date(isoDate);

  const formattedDate = `${('0' + date.getDate()).slice(-2)}/${(
    '0' +
    (date.getMonth() + 1)
  ).slice(-2)}/${date.getFullYear()}`;

  return formattedDate;
}

const checkAndroidStoragePermsion = async () => {
  let checkPermision: any;
  await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
    .then(result => {
      console.log(result, 'result');
      if (result === 'granted') {
        checkPermision = result;
      } else {
        requestAndroidStoragePermsion();
      }
    })
    .catch(err => {
      checkPermision = err;
    });
  // await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(async result => {
  //   switch (result) {
  //     case RESULTS.UNAVAILABLE:
  //       console.log(
  //         'This feature is not available (on this device / in this context)',
  //       );
  //       break;
  //     case RESULTS.DENIED:
  //       console.log(
  //         'The permission has not been requested / is denied but requestable',
  //         result,
  //       );
  //       await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(res => {
  //         console.log(res, 'res');
  //       });
  //       break;
  //     case RESULTS.LIMITED:
  //       console.log('The permission is limited: some actions are possible');
  //       break;
  //     case RESULTS.GRANTED:
  //       console.log('The permission is granted');
  //       break;
  //     case RESULTS.BLOCKED:
  //       console.log('The permission is denied and not requestable anymore');
  //       break;
  //   }
  // });
  // .then(result => {
  //   console.log(result, 'result');
  //   if (result === 'granted') {
  //     checkPermision = result;
  //   } else {
  //     requestAndroidStoragePermsion();
  //   }
  // })
  // .catch(err => {
  //   checkPermision = err;
  // });

  return checkPermision;
};

const requestAndroidStoragePermsion = () => {
  request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, {
    title: 'Storage Permission Required',
    message: 'Application needs access to your storage to download File',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel',
    buttonNeutral: '',
  })
    .then(result => {
      console.log(result, '^^^^^^');
    })
    .catch(err => {
      console.log(err);
    });
};
