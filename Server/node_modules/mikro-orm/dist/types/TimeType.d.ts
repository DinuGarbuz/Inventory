import { Type } from './Type';
import { Platform } from '../platforms';
import { EntityProperty } from '../typings';
export declare class TimeType extends Type {
    convertToDatabaseValue(value: any, platform: Platform): any;
    getColumnType(prop: EntityProperty, platform: Platform): string;
}
