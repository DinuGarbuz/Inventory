import { PropertyOptions } from '.';
export declare function PrimaryKey(options?: PrimaryKeyOptions): Function;
export declare function SerializedPrimaryKey(options?: SerializedPrimaryKeyOptions): Function;
export interface PrimaryKeyOptions extends PropertyOptions {
}
export interface SerializedPrimaryKeyOptions extends PropertyOptions {
    type?: any;
}
