import { PropertyOptions } from '.';
import { Dictionary } from '../typings';
export declare function Enum(options?: EnumOptions | (() => Dictionary)): Function;
export interface EnumOptions extends PropertyOptions {
    items?: (number | string)[] | (() => Dictionary);
}
