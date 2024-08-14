import React from 'react';
import { TextFieldProps } from './types';
declare const ClearButton: ({ testID, onClear, onChangeText }: Pick<TextFieldProps, 'onClear' | 'testID' | 'onChangeText'>) => React.JSX.Element;
export default ClearButton;
