import { action, observable } from 'mobx'
import { has } from 'lodash'

interface StoreContainerData {[key: string]: any}

export default class StoreContainer {
    @observable stores: StoreContainerData = {}

    protected _initializeData: StoreContainerData = {}

    @action
    addStore (key: string, store: any) {
        if (!has(this.stores, key)) {
            this.stores[key] = store

            if (typeof store.deserialize === 'function' && this._initializeData[key]) {
                store.deserialize(this._initializeData[key])
            }
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

    serialize (): StoreContainerData {
        const s: StoreContainerData = {}
        for (const key in this.stores) {
            const store = this.stores[key]
            if (typeof store.serialize === 'function') {
                s[key] = store.serialize()
            }
        }

        return s
    }

    deserialize (data: StoreContainerData) {
        this._initializeData = data
        for (const key in this.stores) {
            const store = this.stores[key]

            if (typeof store.deserialize === 'function' && data[key]) {
                store.deserialize(data[key])
            }
        }
    }
}
