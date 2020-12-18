import * as React from 'react'
import { observer, inject, Provider } from 'mobx-react'
import StoreContainer from './store-container'

interface Props {
    names: string[],
    container?: StoreContainer,
    factories?: { [id: string]: { (...dependencies: any[]): any }}
    dependencies?: { [id: string]: string[]}
}

interface State {}

class DynamicProvider extends React.Component<Props, State> {
    constructor (props: Props) {
        super(props)

        for (const name of this.props.names) {
            if (this.props.container && !this.props.container.has(name) && this.props.factories && this.props.factories[name]) {
                const dependencies: any[] = []
                if (this.props.dependencies && this.props.dependencies[name]) {
                    for (const dependency of this.props.dependencies[name]) {
                        dependencies.push(this.props.container.has(dependency) ? this.props.container.get(dependency) : null)
                    }
                }

                this.props.container.addStore(name, this.props.factories[name](...dependencies))
            }
        }
    }

    render () {
        const stores: {[key: string]: any} = {}

        for (const name of this.props.names) {
            if (!this.props.container || !this.props.container.has(name)) {
                return <></>
            }

            stores[name] = this.props.container.get(name)
        }

        return (
            <Provider {...stores}>
                {React.Children.only(this.props.children)}
            </Provider>
        )
    }
}

export default inject('container')(observer(DynamicProvider))
