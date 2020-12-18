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
            if (this.props.container && !this.props.container.has(name) && this.props.factories && this.props.factories[name]) {
                const dependencies = [];
                if (this.props.dependencies && this.props.dependencies[name]) {
                    for (const dependency of this.props.dependencies[name]) {
                        dependencies.push(this.props.container.has(dependency) ? this.props.container.get(dependency) : null);
                    }
                }
                this.props.container.addStore(name, this.props.factories[name](...dependencies));
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
        return (React.createElement(mobx_react_1.Provider, Object.assign({}, stores), React.Children.only(this.props.children)));
    }
}
exports.default = mobx_react_1.inject('container')(mobx_react_1.observer(DynamicProvider));
