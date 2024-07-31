import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {Colors} from '../../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppText from '../../components/shared/text/AppText';
import {variable} from '../../styles/colors';
import {useAppSelector} from '../../components/shared/hooks/useAppSelector';
import AbhaCreationAPI from '../../services/ApiHelpers/AbhaCreationAPI';
import FullScreenLoader from '../../components/shared/FullScreenLoader';
import {setAbhaCardDetails} from '../../services/store/slices/yatriSlice';
import {useDispatch} from 'react-redux';
import {prepareToDownload} from '../../utils/Helper';

const Abha = () => {
  const dispatch = useDispatch();
  const abhaCardDetails = useAppSelector(s => s.yatri.abhaCardDetails);
  const yatriAllDetails = useAppSelector(s => s.yatri.yatriAllDetails);
  const imageFetchTriedCountRef = useRef(0);
  const pdfFetchTriedCountRef = useRef(0);
  const imageFetchTimerRef = useRef<any>(null);
  const pdfFetchTimerRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchImageFlow = useCallback(
    (isUseDelay: boolean) => {
      imageFetchTimerRef.current = setTimeout(
        () => {
          imageFetchTriedCountRef.current += 1;
          AbhaCreationAPI.fetchAbhaCard(
            isUseDelay
              ? {
                  authType: 'v2',
                }
              : {},
          )
            .then(response => {
              dispatch(
                setAbhaCardDetails({
                  abhaCardImage: response?.data?.preSignedUrl,
                }),
                setIsLoading(false),
              );
            })
            .catch(
              () => imageFetchTriedCountRef.current < 5 && fetchImageFlow(true),
            );
        },
        isUseDelay ? 5000 : 0,
      );
    },
    [dispatch],
  );
  useEffect(() => {
    if (
      abhaCardDetails?.abhaCardImage ||
      !(
        imageFetchTriedCountRef.current < 5 &&
        imageFetchTimerRef.current === null
      )
    ) {
      return;
    } else {
      fetchImageFlow(false);
    }
    return () => {
      if (imageFetchTimerRef.current !== null) {
        clearTimeout(imageFetchTimerRef.current);
        imageFetchTimerRef.current = null;
      }
    };
  }, [abhaCardDetails, dispatch, fetchImageFlow]);

  const fetchPdfFlow = useCallback(
    (isUseDelay: boolean) => {
      pdfFetchTimerRef.current = setTimeout(
        () => {
          pdfFetchTriedCountRef.current += 1;
          AbhaCreationAPI.fetchAbhaCardPdf(
            isUseDelay
              ? {
                  authType: 'v2',
                }
              : {},
          )
            .then(response => {
              dispatch(
                setAbhaCardDetails({
                  abhaCardPdfUrl: response?.data?.preSignedUrl,
                }),
                setIsLoading(false),
              );
            })
            .catch(
              () => pdfFetchTriedCountRef.current < 5 && fetchPdfFlow(true),
            );
        },
        isUseDelay ? 5000 : 0,
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (
      abhaCardDetails?.abhaCardPdfUrl ||
      !(pdfFetchTriedCountRef.current < 5 && pdfFetchTimerRef.current === null)
    ) {
      return;
    } else {
      fetchPdfFlow(false);
    }
    return () => {
      if (pdfFetchTimerRef.current !== null) {
        clearTimeout(pdfFetchTimerRef.current);
        pdfFetchTimerRef.current = null;
      }
    };
  }, [abhaCardDetails, dispatch, fetchPdfFlow]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContentContainer}>
        <View>
          <AppText
            customStyles={
              styles.title
            }>{`Hi, ${yatriAllDetails.data?.yatriDetails?.fullName}`}</AppText>
          <AppText customStyles={styles.description}>
            Congratulations! Your ABHA (Ayushman Bharat Health Account) card has
            been created successfully.
          </AppText>
        </View>
        <View style={styles.downloadButtonWrapper}>
          <TouchableOpacity
            style={styles.textButton}
            onPress={() => {
              prepareToDownload(abhaCardDetails?.abhaCardPdfUrl);
            }}>
            <Text style={styles.textButtonText}>Download PDF</Text>
            <Icon name="download" size={20} style={styles.downloadIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.textButton}
            onPress={() => {
              prepareToDownload(abhaCardDetails?.abhaCardImage);
            }}>
            <Text style={styles.textButtonText}>Download Image</Text>
            <Icon name="download" size={20} style={styles.downloadIcon} />
          </TouchableOpacity>
        </View>
        {abhaCardDetails?.abhaCardImage && (
          <Image
            style={styles.abhaCardImage}
            source={{
              uri: abhaCardDetails.abhaCardImage,
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Abha;

const styles = StyleSheet.create({
  flex: {flex: 1},
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  downloadButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  textButton: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  textButtonText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'left',
    color: Colors.primary.brand,
    textDecorationLine: 'underline',
    marginHorizontal: 8,
  },
  downloadIcon: {
    color: Colors.primary.brand,
  },
  title: {
    fontSize: 18,
    color: variable.primary,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    color: variable.descriptionText,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  abhaCardImage: {
    width: '100%',
    flex: 1,
    resizeMode: 'center',
  },
});
