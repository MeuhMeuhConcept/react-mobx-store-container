var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, observable } from 'mobx';
import { has } from 'lodash';
export default class StoreContainer {
    constructor() {
        this.stores = {};
    }
    addStore(key, store) {
        if (!has(this.stores, key)) {
            this.stores[key] = store;
        }
    }
    has(key) {
        return has(this.stores, key);
    }
    get(key) {
        if (this.has(key)) {
            return this.stores[key];
        }
    }
}
__decorate([
    observable
], StoreContainer.prototype, "stores", void 0);
__decorate([
    action
], StoreContainer.prototype, "addStore", null);
