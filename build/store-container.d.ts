export default class StoreContainer {
    stores: {
        [key: string]: any;
    };
    addStore(key: string, store: any): void;
    has(key: string): boolean;
    get(key: string): any;
}
