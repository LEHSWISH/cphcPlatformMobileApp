import {View} from 'react-native';
import React, {useState} from 'react';
import StepIndicator from 'react-native-step-indicator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {IStepper} from '../../../interfaces/stepperStepsTypes/IStepper';

const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 4,
  stepStrokeCurrentColor: '#33189F',
  separatorFinishedColor: '#33189F',
  separatorUnFinishedColor: '#33189F',
  stepIndicatorFinishedColor: '#33189F',
  stepIndicatorUnFinishedColor: '#33189F',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: '#000000',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
  labelColor: '#666666',
  labelSize: 12,
  currentStepLabelColor: '#33189F',
};

const Stepper = (props: IStepper) => {
  const [currentPosition, setCurrentPosition] = useState<number>(
    props?.currentStepNumber,
  );
  const onStepPress = (position: number) => {
    setCurrentPosition(position);
  };

  return (
    <SafeAreaProvider>
      <View>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentPosition}
          labels={props.labels}
          onPress={onStepPress}
          stepCount={props?.stepCount}
        />
      </View>
    </SafeAreaProvider>
  );
};

export default Stepper;
