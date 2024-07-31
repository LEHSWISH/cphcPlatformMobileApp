import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {FlatList} from 'react-native';
import FAQ from '../../components/core/faq/FAQ';
import {HomeFragmentStackParamList} from '../../navigation/stack/HomeFragmentStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Seprator from '../../components/shared/seprator/Seprator';
import {variable} from '../../styles/colors';

export interface FAQRoutesType {
  data: {
    [key: string]: {
      question: string;
      answer: string;
    };
  };
}

type FAQAllContentPropsType = NativeStackScreenProps<
  HomeFragmentStackParamList,
  'FAQAllContent'
>;
const ItemSepratorComp = () => <Seprator />;

const FAQAllContent = ({route}: FAQAllContentPropsType) => {
  const data = Object.values(route.params.data);

  return (
    <>
      <SafeAreaView style={styles.faqArea}>
        <FlatList
          style={styles.faqContent}
          data={data}
          ItemSeparatorComponent={ItemSepratorComp}
          renderItem={({index, item}) => {
            return (
              <>
                <FAQ title={item.question} details={item.answer} key={index} />
              </>
            );
          }}
        />
      </SafeAreaView>
    </>
  );
};

export default FAQAllContent;

const styles = StyleSheet.create({
  faqArea: {
    backgroundColor: variable.whiteBackground,
    paddingBottom: 10,
  },
  faqContent: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
});
