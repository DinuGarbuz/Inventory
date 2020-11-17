"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Type_1 = require("./Type");
/**
 * This type will automatically convert string values returned from the database to native JS bigints.
 */
class BigIntType extends Type_1.Type {
    convertToDatabaseValue(value, platform) {
        return '' + value;
    }
    convertToJSValue(value, platform) {
        return '' + value;
    }
    getColumnType(prop, platform) {
        return platform.getBigIntTypeDeclarationSQL();
    }
}
exports.BigIntType = BigIntType;
