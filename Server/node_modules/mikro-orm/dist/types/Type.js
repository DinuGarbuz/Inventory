"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Type {
    /**
     * Converts a value from its JS representation to its database representation of this type.
     */
    convertToDatabaseValue(value, platform) {
        return value;
    }
    /**
     * Converts a value from its database representation to its JS representation of this type.
     */
    convertToJSValue(value, platform) {
        return value;
    }
    /**
     * Converts a value from its JS representation to its serialized JSON form of this type.
     * By default converts to the database value.
     */
    toJSON(value, platform) {
        return this.convertToDatabaseValue(value, platform);
    }
    /**
     * Gets the SQL declaration snippet for a field of this type.
     */
    getColumnType(prop, platform) {
        return prop.columnTypes[0];
    }
    static getType(cls) {
        const key = cls.name;
        if (!Type.types.has(key)) {
            Type.types.set(key, new cls());
        }
        return Type.types.get(key);
    }
}
exports.Type = Type;
Type.types = new Map();
