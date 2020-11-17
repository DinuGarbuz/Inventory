"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractNamingStrategy_1 = require("./AbstractNamingStrategy");
class UnderscoreNamingStrategy extends AbstractNamingStrategy_1.AbstractNamingStrategy {
    classToTableName(entityName) {
        return this.underscore(entityName);
    }
    joinColumnName(propertyName) {
        return this.underscore(propertyName) + '_' + this.referenceColumnName();
    }
    joinKeyColumnName(entityName, referencedColumnName) {
        return this.classToTableName(entityName) + '_' + (referencedColumnName || this.referenceColumnName());
    }
    joinTableName(sourceEntity, targetEntity, propertyName) {
        return this.classToTableName(sourceEntity) + '_to_' + this.classToTableName(targetEntity);
    }
    propertyToColumnName(propertyName) {
        return this.underscore(propertyName);
    }
    referenceColumnName() {
        return 'id';
    }
    underscore(name) {
        return name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    }
}
exports.UnderscoreNamingStrategy = UnderscoreNamingStrategy;
