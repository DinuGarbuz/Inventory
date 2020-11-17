"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractNamingStrategy_1 = require("./AbstractNamingStrategy");
/**
 * This strategy keeps original entity/property names for table/column.
 */
class EntityCaseNamingStrategy extends AbstractNamingStrategy_1.AbstractNamingStrategy {
    classToTableName(entityName) {
        return entityName;
    }
    joinColumnName(propertyName) {
        return propertyName;
    }
    joinKeyColumnName(entityName, referencedColumnName) {
        return entityName.substr(0, 1).toLowerCase() + entityName.substr(1);
    }
    joinTableName(sourceEntity, targetEntity, propertyName) {
        return this.classToTableName(sourceEntity) + '_to_' + this.classToTableName(targetEntity);
    }
    propertyToColumnName(propertyName) {
        return propertyName;
    }
    referenceColumnName() {
        return 'id';
    }
}
exports.EntityCaseNamingStrategy = EntityCaseNamingStrategy;
