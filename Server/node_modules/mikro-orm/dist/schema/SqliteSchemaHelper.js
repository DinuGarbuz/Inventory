"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemaHelper_1 = require("./SchemaHelper");
class SqliteSchemaHelper extends SchemaHelper_1.SchemaHelper {
    getSchemaBeginning(charset) {
        return 'pragma foreign_keys = off;\n\n';
    }
    getSchemaEnd() {
        return 'pragma foreign_keys = on;\n';
    }
    isSame(prop, type, idx) {
        return super.isSame(prop, type, idx, SqliteSchemaHelper.TYPES);
    }
    getTypeDefinition(prop) {
        const t = prop.type.toLowerCase();
        return (SqliteSchemaHelper.TYPES[t] || SqliteSchemaHelper.TYPES.string)[0];
    }
    getTypeFromDefinition(type, defaultType) {
        return super.getTypeFromDefinition(type, defaultType, SqliteSchemaHelper.TYPES);
    }
    supportsSchemaConstraints() {
        return false;
    }
    getListTablesSQL() {
        return `select name as table_name from sqlite_master where type = 'table' and name != 'sqlite_sequence' and name != 'geometry_columns' and name != 'spatial_ref_sys' `
            + `union all select name as table_name from sqlite_temp_master where type = 'table' order by name`;
    }
    async getColumns(connection, tableName, schemaName) {
        const columns = await connection.execute(`pragma table_info('${tableName}')`);
        return columns.map(col => ({
            name: col.name,
            type: col.type,
            defaultValue: col.dflt_value,
            nullable: !col.notnull,
            primary: !!col.pk,
        }));
    }
    async getPrimaryKeys(connection, indexes, tableName, schemaName) {
        const sql = `pragma table_info(\`${tableName}\`)`;
        const cols = await connection.execute(sql);
        return cols.filter(col => !!col.pk).map(col => col.name);
    }
    async getIndexes(connection, tableName, schemaName) {
        const indexes = await connection.execute(`pragma index_list(\`${tableName}\`)`);
        for (const index of indexes) {
            const res = await connection.execute(`pragma index_info(\`${index.name}\`)`);
            index.column_name = res[0].name;
        }
        return indexes.map(index => ({
            columnName: index.column_name,
            keyName: index.name,
            unique: !!index.unique,
            primary: false,
        }));
    }
    getRenameColumnSQL(tableName, from, to, idx = 0) {
        return super.getRenameColumnSQL(tableName, from, to, idx, '`');
    }
    getForeignKeysSQL(tableName) {
        return `pragma foreign_key_list(\`${tableName}\`)`;
    }
    mapForeignKeys(fks) {
        return fks.reduce((ret, fk) => {
            ret[fk.from] = {
                columnName: fk.from,
                referencedTableName: fk.table,
                referencedColumnName: fk.to,
                updateRule: fk.on_update,
                deleteRule: fk.on_delete,
            };
            return ret;
        }, {});
    }
    supportsColumnAlter() {
        return false;
    }
    async databaseExists(connection, name) {
        return true;
    }
}
exports.SqliteSchemaHelper = SqliteSchemaHelper;
SqliteSchemaHelper.TYPES = {
    number: ['integer', 'int', 'tinyint', 'smallint', 'bigint'],
    tinyint: ['integer'],
    smallint: ['integer'],
    bigint: ['integer'],
    boolean: ['integer', 'int'],
    string: ['varchar', 'text'],
    Date: ['datetime', 'text'],
    date: ['datetime', 'text'],
    object: ['text'],
    text: ['text'],
};
