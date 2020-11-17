"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Platform_1 = require("./Platform");
const naming_strategy_1 = require("../naming-strategy");
class MongoPlatform extends Platform_1.Platform {
    usesPivotTable() {
        return false;
    }
    getNamingStrategy() {
        return naming_strategy_1.MongoNamingStrategy;
    }
    normalizePrimaryKey(data) {
        if (data instanceof mongodb_1.ObjectId) {
            return data.toHexString();
        }
        return data;
    }
    denormalizePrimaryKey(data) {
        return new mongodb_1.ObjectId(data);
    }
    getSerializedPrimaryKeyField(field) {
        return 'id';
    }
    usesImplicitTransactions() {
        return false;
    }
}
exports.MongoPlatform = MongoPlatform;
