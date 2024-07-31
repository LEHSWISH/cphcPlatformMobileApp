import {StyleSheet, View} from 'react-native';
import React from 'react';
import {List} from 'react-native-paper';

const Accordion = () => {
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);
  return (
    <View style={{paddingVertical: 4}}>
      <List.Accordion
        titleStyle={{}}
        title="What is the overall route of the Char Dham Yatra, connecting the four sacred sites?"
        expanded={expanded}
        onPress={handlePress}>
        <List.Item title="Elderly or chronically ill pilgrims should carry copies of doctor's notes, prescriptions, and emergency contacts." />
      </List.Accordion>
    </View>
  );
};

export default Accordion;

const styles = StyleSheet.create({});
