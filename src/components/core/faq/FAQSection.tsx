import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import FAQ from './FAQ';
import {Colors} from '../../../styles';
import ButtonComponent from '../../shared/button/ButtonComponent';
import {ButtonType} from '../../../enums/buttonType/ButtonType';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Seprator from '../../shared/seprator/Seprator';
import {HomeFragmentStackParamList} from '../../../navigation/stack/HomeFragmentStack';
import {faqStaticJson} from '../../../assets/data/faqStaticJSON';

const FAQSection = () => {
  const navigation =
    useNavigation<NavigationProp<HomeFragmentStackParamList>>();
  const [faqData, setFaqData] = useState<{
    [key: string]: {question: string; answer: string};
  }>({});

  useEffect(() => {
    setFaqData(faqStaticJson);
  }, []);

  return (
    <View style={styles.section}>
      <Text style={styles.faqText}>FAQs (Frequently Asked Questions)</Text>
      <View style={styles.faqContainer}>
        <>
          {Object.values(faqData)
            .slice(0, 3)
            .map((faq, index) => {
              return (
                <React.Fragment key={index.toString()}>
                  <FAQ title={faq.question} details={faq.answer} />
                  <Seprator />
                </React.Fragment>
              );
            })}
        </>
        <View style={styles.viewMoreBtn}>
          <ButtonComponent
            label="View more"
            type={ButtonType.TEXT_BUTTON}
            onPress={() => {
              navigation.navigate('FAQAllContent', {data: faqData});
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default FAQSection;

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 15,
  },
  faq: {
    padding: 5,
  },
  faqText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: '#202020',
    paddingBottom: 10,
    paddingTop: 20,
  },
  faqContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    borderColor: Colors.neutral.borderColor,
  },
  viewMoreBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
});
