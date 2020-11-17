import { Type } from './Type';
import { Platform } from '../platforms';
import { EntityProperty } from '../typings';
export declare class DateType extends Type {
    convertToDatabaseValue(value: any, platform: Platform): any;
    convertToJSValue(value: any, platform: Platform): any;
    getColumnType(prop: EntityProperty, platform: Platform): string;
}
