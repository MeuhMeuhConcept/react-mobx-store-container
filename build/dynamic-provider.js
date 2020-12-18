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
            if (typeof name === 'string') {
                if (this.props.container && !this.props.container.hasFactory(name) && this.props.factories && this.props.factories[name]) {
                    const creator = this.props.factories[name];
                    const factory = {
                        key: name,
                        dependencies: this.props.dependencies && this.props.dependencies[name] ? this.props.dependencies[name] : [],
                        create: (...dependencies) => creator(...dependencies)
                    };
                    this.props.container.addFactory(factory);
                }
            }
            else {
                if (this.props.container) {
                    this.props.container.addFactory(name);
                }
            }
        }
    }
    render() {
        const stores = {};
        for (const name of this.props.names) {
            const key = (typeof name === 'string') ? name : name.key;
            if (!this.props.container || !this.props.container.has(key)) {
                return React.createElement(React.Fragment, null);
            }
            stores[key] = this.props.container.get(key);
        }
        return (React.createElement(mobx_react_1.Provider, Object.assign({}, stores), React.Children.only(this.props.children)));
    }
}
exports.default = mobx_react_1.inject('container')(mobx_react_1.observer(DynamicProvider));
