import { type ComponentProps } from '../../testkit/new/Component.driver';
export declare const ExpandableOverlayDriver: (props: ComponentProps) => {
    exists: () => boolean;
    open: () => void;
    isOpen: () => boolean;
    pressOnBackground: () => void;
};
