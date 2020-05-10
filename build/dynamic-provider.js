import * as React from 'react';
import { observer, inject, Provider } from 'mobx-react';
class DynamicProvider extends React.Component {
    constructor(props) {
        super(props);
        for (const name of this.props.names) {
            if (this.props.container && !this.props.container.has(name) && this.props.factories && this.props.factories[name]) {
                this.props.container.addStore(name, this.props.factories[name]());
            }
        }
    }
    render() {
        const stores = {};
        for (const name of this.props.names) {
            if (!this.props.container || !this.props.container.has(name)) {
                return React.createElement(React.Fragment, null);
            }
            stores[name] = this.props.container.get(name);
        }
        return (React.createElement(Provider, Object.assign({}, stores), React.Children.only(this.props.children)));
    }
}
export default inject('container')(observer(DynamicProvider));
