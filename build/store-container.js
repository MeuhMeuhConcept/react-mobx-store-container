"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const lodash_1 = require("lodash");
class StoreContainer {
    constructor() {
        this.stores = {};
        this._initializeData = {};
        this.factories = [];
    }
    addStore(key, store) {
        if (!lodash_1.has(this.stores, key)) {
            this.stores[key] = store;
            if (typeof store.deserialize === 'function' && this._initializeData[key]) {
                store.deserialize(this._initializeData[key]);
            }
        }
    }
    has(key) {
        return this.keys.indexOf(key) >= 0;
    }
    get(key) {
        return this._get(key, []);
    }
    _get(key, parents) {
        if (this.ready(key)) {
            return this.stores[key];
        }
        const factory = this.getFactory(key);
        if (factory === undefined) {
            return undefined;
        }
        const dependencies = [];
        for (const dependency of factory.dependencies) {
            if (dependency === factory.key) {
                throw new Error('auto dependence ' + factory.key + ' => ' + dependency);
            }
            if (parents.indexOf(dependency) >= 0) {
                throw new Error('cirular dependencies ' + parents.join(' -> ') + ' -> ' + factory.key + ' => ' + dependency);
            }
            const d = this._get(dependency, parents.concat([factory.key]));
            if (d === undefined) {
                throw new Error('no dependency with key : ' + dependency);
            }
            dependencies.push(d);
        }
        const store = factory.create(...dependencies);
        this.addStore(factory.key, store);
        return store;
    }
    ready(key) {
        return lodash_1.has(this.stores, key);
    }
    get keys() {
        const keys = Object.keys(this.stores);
        for (const factory of this.factories) {
            if (keys.indexOf(factory.key) < 0) {
                keys.push(factory.key);
            }
        }
        return keys;
    }
    addFactories(factories) {
        for (const factory of factories) {
            this.addFactory(factory);
        }
        return this;
    }
    addFactory(factory) {
        if (!this.hasFactory(factory.key)) {
            this.factories.push(factory);
        }
        return this;
    }
    hasFactory(key) {
        for (const factory of this.factories) {
            if (factory.key === key) {
                return true;
            }
        }
        return false;
    }
    getFactory(key) {
        for (const factory of this.factories) {
            if (factory.key === key) {
                return factory;
            }
        }
    }
    serialize() {
        const s = {};
        for (const key in this.stores) {
            const store = this.stores[key];
            if (typeof store.serialize === 'function') {
                s[key] = store.serialize();
            }
        }
        return s;
    }
    deserialize(data) {
        this._initializeData = data;
        for (const key in this.stores) {
            const store = this.stores[key];
            if (typeof store.deserialize === 'function' && data[key]) {
                store.deserialize(data[key]);
            }
        }
    }
}
__decorate([
    mobx_1.observable
], StoreContainer.prototype, "stores", void 0);
__decorate([
    mobx_1.observable
], StoreContainer.prototype, "factories", void 0);
__decorate([
    mobx_1.action
], StoreContainer.prototype, "addStore", null);
__decorate([
    mobx_1.computed
], StoreContainer.prototype, "keys", null);
__decorate([
    mobx_1.action
], StoreContainer.prototype, "addFactory", null);
exports.default = StoreContainer;
