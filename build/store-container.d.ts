interface StoreContainerData {
    [key: string]: any;
}
export default class StoreContainer {
    stores: StoreContainerData;
    protected _initializeData: StoreContainerData;
    addStore(key: string, store: any): void;
    has(key: string): boolean;
    get(key: string): any;
    serialize(): StoreContainerData;
    deserialize(data: StoreContainerData): void;
}
export {};
