import { action, observable, computed } from 'mobx'
import { has } from 'lodash'
import StoreFactory from './store-factory'

interface StoreContainerData {[key: string]: any}

export default class StoreContainer {
    @observable stores: StoreContainerData = {}

    protected _initializeData: StoreContainerData = {}

    @observable factories: StoreFactory[] = []

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
        return this.keys.indexOf(key) >= 0
    }

    get (key: string) {
        return this._get(key, [])
    }

    protected _get (key: string, parents: string[]) {

        if (this.ready(key)) {
            return this.stores[key]
        }

        const factory = this.getFactory(key)
        if (factory === undefined) {
            return undefined
        }

        const dependencies: any[] = []

        for (const dependency of factory.dependencies) {
            if (dependency === factory.key) {
                throw new Error('auto dependence ' + factory.key + ' => ' + dependency)
            }
            if (parents.indexOf(dependency) >= 0) {
                throw new Error('cirular dependencies ' + parents.join(' -> ') + ' -> ' + factory.key + ' => ' + dependency)
            }

            const d = this._get(dependency, parents.concat([factory.key]))

            if (d === undefined) {
                throw new Error('no dependency with key : ' + dependency)
            }

            dependencies.push(d)
        }

        const store = factory.create(...dependencies)

        this.addStore(factory.key, store)

        return store
    }

    ready (key: string) {
        return has(this.stores, key)
    }

    @computed
    get keys (): string[] {
        const keys: string[] = Object.keys(this.stores)

        for (const factory of this.factories) {
            if (keys.indexOf(factory.key) < 0) {
                keys.push(factory.key)
            }
        }

        return keys
    }

    addFactories (factories: StoreFactory[]): this {
        for (const factory of factories) {
            this.addFactory(factory)
        }

        return this
    }

    addFactory (factory: StoreFactory): this {
        if (!this.hasFactory(factory.key)) {
            this.factories.push(factory)
        }

        return this
    }

    hasFactory (key: string): boolean {
        for (const factory of this.factories) {
            if (factory.key === key) {
                return true
            }
        }

        return false
    }

    getFactory (key: string): StoreFactory | undefined {
        for (const factory of this.factories) {
            if (factory.key === key) {
                return factory
            }
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
