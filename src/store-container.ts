import { action, observable } from 'mobx'
import { has } from 'lodash'

export default class StoreContainer {
    @observable stores: {[key: string]: any} = {}

    @action
    addStore (key: string, store: any) {
        if (!has(this.stores, key)) {
            this.stores[key] = store
        }
    }

    has (key: string) {
        return has(this.stores, key)
    }

    get (key: string) {
        if (this.has(key)) {
            return this.stores[key]
        }
    }
}
