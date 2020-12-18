"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
class DynamicProvider extends React.Component {
    constructor(props) {
        super(props);
        for (const name of this.props.names) {
            const reference = (typeof name === 'function') ? name() : name;
            if (typeof reference === 'string') {
                if (this.props.container && !this.props.container.hasFactory(reference) && this.props.factories && this.props.factories[reference]) {
                    const creator = this.props.factories[reference];
                    const factory = {
                        key: reference,
                        dependencies: this.props.dependencies && this.props.dependencies[reference] ? this.props.dependencies[reference] : [],
                        create: (...dependencies) => creator(...dependencies)
                    };
                    this.props.container.addFactory(factory);
                    this.props.container.get(reference);
                }
            }
            else {
                if (this.props.container) {
                    this.props.container.addFactory(reference);
                    this.props.container.get(reference.key);
                }
            }
        }
    }
    render() {
        const stores = {};
        for (const name of this.props.names) {
            const reference = (typeof name === 'function') ? name() : name;
            const key = (typeof reference === 'string') ? reference : reference.key;
            if (!this.props.container || !this.props.container.has(key)) {
                return React.createElement(React.Fragment, null);
            }
            stores[key] = this.props.container.get(key);
        }
        return (React.createElement(mobx_react_1.Provider, Object.assign({}, stores), React.Children.only(this.props.children)));
    }
}
exports.default = mobx_react_1.inject('container')(mobx_react_1.observer(DynamicProvider));
