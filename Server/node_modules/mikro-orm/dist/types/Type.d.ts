import { Platform } from '../platforms';
import { Constructor, EntityProperty } from '../typings';
export declare abstract class Type {
    private static readonly types;
    /**
     * Converts a value from its JS representation to its database representation of this type.
     */
    convertToDatabaseValue(value: any, platform: Platform): any;
    /**
     * Converts a value from its database representation to its JS representation of this type.
     */
    convertToJSValue(value: any, platform: Platform): any;
    /**
     * Converts a value from its JS representation to its serialized JSON form of this type.
     * By default converts to the database value.
     */
    toJSON(value: any, platform: Platform): any;
    /**
     * Gets the SQL declaration snippet for a field of this type.
     */
    getColumnType(prop: EntityProperty, platform: Platform): string;
    static getType(cls: Constructor<Type>): Type;
}
