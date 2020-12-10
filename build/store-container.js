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
        return lodash_1.has(this.stores, key);
    }
    get(key) {
        if (this.has(key)) {
            return this.stores[key];
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
    mobx_1.action
], StoreContainer.prototype, "addStore", null);
exports.default = StoreContainer;
