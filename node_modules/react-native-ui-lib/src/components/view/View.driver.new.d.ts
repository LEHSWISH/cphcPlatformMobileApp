import { ComponentProps } from '../../testkit/new/Component.driver';
export declare const ViewDriver: (props: ComponentProps) => {
    getStyle: () => any;
    getElement: () => import("react-test-renderer").ReactTestInstance;
    exists: () => boolean;
};
