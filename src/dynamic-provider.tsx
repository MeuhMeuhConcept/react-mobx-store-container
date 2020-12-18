import * as React from 'react'
import { observer, inject, Provider } from 'mobx-react'
import StoreContainer from './store-container'
import StoreFactory from './store-factory'

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
            if (this.props.container && !this.props.container.hasFactory(name) && this.props.factories && this.props.factories[name]) {
                const creator = this.props.factories[name]
                const factory: StoreFactory = {
                    key: name,
                    dependencies: this.props.dependencies && this.props.dependencies[name] ? this.props.dependencies[name] : [],
                    create: (...dependencies: any[]) => creator(...dependencies)
                }

                this.props.container.addFactory(factory)
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
