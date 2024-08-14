import { ComponentProps } from '../../testkit';
export declare const ButtonDriver: (props: ComponentProps) => {
    press: () => void;
    hasOnPress: () => boolean;
    onPressIn: () => void;
    hasOnPressIn: () => boolean;
    onPressOut: () => void;
    hasOnPressOut: () => boolean;
    onLongPress: () => void;
    hasOnLongPress: () => boolean;
    getElement: () => import("react-test-renderer").ReactTestInstance;
    exists: () => boolean;
    getLabel: () => {
        getText: () => string | (string | import("react-test-renderer").ReactTestInstance)[];
        getStyle: () => import("react-native/types").TextStyle;
        press: () => void;
        hasOnPress: () => boolean;
        onPressIn: () => void;
        hasOnPressIn: () => boolean;
        onPressOut: () => void;
        hasOnPressOut: () => boolean;
        onLongPress: () => void;
        hasOnLongPress: () => boolean;
        getElement: () => import("react-test-renderer").ReactTestInstance;
        exists: () => boolean;
    };
    getIcon: () => import("../../testkit/new/Component.driver").ComponentDriverResult;
};
