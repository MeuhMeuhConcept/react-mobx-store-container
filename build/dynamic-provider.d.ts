import * as React from 'react';
import StoreContainer from './store-container';
interface Props {
    names: string[];
    container?: StoreContainer;
    factories?: {
        [id: string]: {
            (): any;
        };
    };
}
interface State {
}
declare class DynamicProvider extends React.Component<Props, State> {
    constructor(props: Props);
    render(): JSX.Element;
}
declare const _default: typeof DynamicProvider & import("mobx-react").IWrappedComponent<Props>;
export default _default;
