import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import React from 'react';
import {Colors} from '../../../styles';
import {ButtonType} from '../../../enums/buttonType/ButtonType';
import {variable} from '../../../styles/colors';

interface ButtonProptype {
  label: string;
  onPress: () => void;
  type?: string;
  touchableOpacityProps?: TouchableOpacityProps;
  customButtonStyle?: StyleProp<ViewStyle>;
  customLabelStyle?: StyleProp<TextStyle>;
}
const ButtonComponent = ({
  label,
  onPress,
  type,
  touchableOpacityProps,
  customButtonStyle,
  customLabelStyle,
}: ButtonProptype) => {
  if (type === ButtonType.TEXT_BUTTON) {
    return (
      <>
        <TouchableOpacity
          style={customButtonStyle}
          onPress={onPress}
          {...touchableOpacityProps}>
          <Text style={[styles.textButton, customLabelStyle]}>{label}</Text>
        </TouchableOpacity>
      </>
    );
  } else if (type === ButtonType.OUTLINE_BUTTON) {
    return (
      <>
        <TouchableOpacity
          style={[styles.outlineButton, customButtonStyle]}
          onPress={onPress}
          {...touchableOpacityProps}>
          <Text style={[styles.outlineButtonLabel, customLabelStyle]}>
            {label}
          </Text>
        </TouchableOpacity>
      </>
    );
  } else {
    return (
      <>
        <TouchableOpacity
          style={[styles.Button, customButtonStyle]}
          onPress={onPress}
          {...touchableOpacityProps}>
          <Text style={[styles.ButtonLabel, customLabelStyle]}>{label}</Text>
        </TouchableOpacity>
      </>
    );
  }
};

export default ButtonComponent;

const styles = StyleSheet.create({
  Button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.variable.primary,
    borderRadius: 10,
    margin: 35,
    paddingHorizontal: 28,
  },
  ButtonLabel: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
    padding: 10,
  },
  textButton: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'left',
    color: variable.primary,
    textDecorationLine: 'underline',
    marginHorizontal: 20,
  },
  outlineButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.variable.whiteBackground,
    borderRadius: 10,
    margin: 35,
  },
  outlineButtonLabel: {
    fontFamily: 'Roboto',
    color: Colors.variable.primary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.variable.primary,
    borderRadius: 8,
  },
});
