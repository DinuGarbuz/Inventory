"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const QueryBuilderHelper_1 = require("./QueryBuilderHelper");
const SmartQueryHelper_1 = require("./SmartQueryHelper");
const entity_1 = require("../entity");
const enums_1 = require("./enums");
const unit_of_work_1 = require("../unit-of-work");
const CriteriaNode_1 = require("./CriteriaNode");
/**
 * SQL query builder
 */
class QueryBuilder {
    constructor(entityName, metadata, driver, context, alias = `e0`, connectionType, em) {
        this.entityName = entityName;
        this.metadata = metadata;
        this.driver = driver;
        this.context = context;
        this.alias = alias;
        this.connectionType = connectionType;
        this.em = em;
        this._populate = [];
        this._populateMap = {};
        this.aliasCounter = 1;
        this.flags = new Set();
        this.finalized = false;
        this._joins = {};
        this._aliasMap = {};
        this._cond = {};
        this._orderBy = {};
        this._groupBy = [];
        this._having = {};
        this.platform = this.driver.getPlatform();
        this.knex = this.driver.getConnection(this.connectionType).getKnex();
        this.helper = new QueryBuilderHelper_1.QueryBuilderHelper(this.entityName, this.alias, this._aliasMap, this.metadata, this.knex, this.platform);
    }
    select(fields, distinct = false) {
        this._fields = utils_1.Utils.asArray(fields);
        if (distinct) {
            this.flags.add(enums_1.QueryFlag.DISTINCT);
        }
        return this.init(enums_1.QueryType.SELECT);
    }
    addSelect(fields) {
        return this.select([...utils_1.Utils.asArray(this._fields), ...utils_1.Utils.asArray(fields)]);
    }
    insert(data) {
        return this.init(enums_1.QueryType.INSERT, data);
    }
    update(data) {
        return this.init(enums_1.QueryType.UPDATE, data);
    }
    delete(cond = {}) {
        return this.init(enums_1.QueryType.DELETE, undefined, cond);
    }
    truncate() {
        return this.init(enums_1.QueryType.TRUNCATE);
    }
    count(field, distinct = false) {
        this._fields = [...(field ? utils_1.Utils.asArray(field) : this.metadata.get(this.entityName).primaryKeys)];
        if (distinct) {
            this.flags.add(enums_1.QueryFlag.DISTINCT);
        }
        return this.init(enums_1.QueryType.COUNT);
    }
    join(field, alias, cond = {}, type = 'innerJoin', path) {
        const extraFields = this.joinReference(field, alias, cond, type, path);
        this._fields.push(...extraFields);
        return this;
    }
    leftJoin(field, alias, cond = {}) {
        return this.join(field, alias, cond, 'leftJoin');
    }
    where(cond, params, operator) {
        cond = SmartQueryHelper_1.SmartQueryHelper.processWhere(cond, this.entityName, this.metadata.get(this.entityName, false, false));
        if (utils_1.Utils.isString(cond)) {
            cond = { [`(${cond})`]: utils_1.Utils.asArray(params) };
            operator = operator || '$and';
        }
        const op = operator || params;
        const topLevel = !op || Object.keys(this._cond).length === 0;
        if (topLevel) {
            this._cond = CriteriaNode_1.CriteriaNode.create(this.metadata, this.entityName, cond).process(this);
        }
        else if (Array.isArray(this._cond[op])) {
            this._cond[op].push(CriteriaNode_1.CriteriaNode.create(this.metadata, this.entityName, cond).process(this));
        }
        else {
            const cond1 = [this._cond, CriteriaNode_1.CriteriaNode.create(this.metadata, this.entityName, cond).process(this)];
            this._cond = { [op]: cond1 };
        }
        return this;
    }
    andWhere(cond, params) {
        return this.where(cond, params, '$and');
    }
    orWhere(cond, params) {
        return this.where(cond, params, '$or');
    }
    orderBy(orderBy) {
        this._orderBy = CriteriaNode_1.CriteriaNode.create(this.metadata, this.entityName, orderBy).process(this);
        return this;
    }
    groupBy(fields) {
        this._groupBy = utils_1.Utils.asArray(fields);
        return this;
    }
    having(cond, params) {
        if (utils_1.Utils.isString(cond)) {
            cond = { [`(${cond})`]: utils_1.Utils.asArray(params) };
        }
        this._having = CriteriaNode_1.CriteriaNode.create(this.metadata, this.entityName, cond).process(this);
        return this;
    }
    /**
     * @internal
     */
    populate(populate) {
        this._populate = populate;
        return this;
    }
    limit(limit, offset = 0) {
        this._limit = limit;
        if (offset) {
            this.offset(offset);
        }
        return this;
    }
    offset(offset) {
        this._offset = offset;
        return this;
    }
    withSchema(schema) {
        this._schema = schema;
        return this;
    }
    setLockMode(mode) {
        if ([unit_of_work_1.LockMode.NONE, unit_of_work_1.LockMode.PESSIMISTIC_READ, unit_of_work_1.LockMode.PESSIMISTIC_WRITE].includes(mode) && !this.context) {
            throw utils_1.ValidationError.transactionRequired();
        }
        this.lockMode = mode;
        return this;
    }
    setFlag(flag) {
        this.flags.add(flag);
        return this;
    }
    getKnexQuery() {
        this.finalize();
        const qb = this.getQueryBase();
        utils_1.Utils.runIfNotEmpty(() => this.helper.appendQueryCondition(this.type, this._cond, qb), this._cond);
        utils_1.Utils.runIfNotEmpty(() => qb.groupBy(this.prepareFields(this._groupBy, 'groupBy')), this._groupBy);
        utils_1.Utils.runIfNotEmpty(() => this.helper.appendQueryCondition(this.type, this._having, qb, undefined, 'having'), this._having);
        utils_1.Utils.runIfNotEmpty(() => qb.orderBy(this.helper.getQueryOrder(this.type, this._orderBy, this._populateMap)), this._orderBy);
        utils_1.Utils.runIfNotEmpty(() => qb.limit(this._limit), this._limit);
        utils_1.Utils.runIfNotEmpty(() => qb.offset(this._offset), this._offset);
        if (this.type === enums_1.QueryType.TRUNCATE && this.platform.usesCascadeStatement()) {
            return this.knex.raw(qb.toSQL().toNative().sql + ' cascade');
        }
        this.helper.getLockSQL(qb, this.lockMode);
        this.helper.finalize(this.type, qb, this.metadata.get(this.entityName, false, false));
        return qb;
    }
    getQuery() {
        return this.getKnexQuery().toSQL().toNative().sql;
    }
    getParams() {
        return this.getKnexQuery().toSQL().toNative().bindings;
    }
    getAliasForEntity(entityName, node) {
        if (node.prop) {
            const join = Object.values(this._joins).find(j => j.path === node.getPath());
            if (!join) {
                return undefined;
            }
        }
        const found = Object.entries(this._aliasMap).find(([, e]) => e === entityName);
        return found ? found[0] : undefined;
    }
    getNextAlias() {
        return `e${this.aliasCounter++}`;
    }
    async execute(method = 'all', mapResults = true) {
        const type = this.connectionType || (method === 'run' ? 'write' : 'read');
        const res = await this.driver.getConnection(type).execute(this.getKnexQuery(), [], method);
        const meta = this.metadata.get(this.entityName, false, false);
        if (!mapResults) {
            return res;
        }
        if (method === 'all' && Array.isArray(res)) {
            return res.map(r => this.driver.mapResult(r, meta));
        }
        return this.driver.mapResult(res, meta);
    }
    async getResult() {
        const res = await this.execute('all', true);
        return res.map(r => this.em.map(this.entityName, r));
    }
    async getSingleResult() {
        const res = await this.getResult();
        return res[0] || null;
    }
    clone() {
        const qb = new QueryBuilder(this.entityName, this.metadata, this.driver, this.context, this.alias, this.connectionType, this.em);
        Object.assign(qb, this);
        // clone array/object properties
        const properties = ['flags', '_fields', '_populate', '_populateMap', '_joins', '_aliasMap', '_cond', '_data', '_orderBy', '_schema'];
        properties.forEach(prop => qb[prop] = utils_1.Utils.copy(this[prop]));
        qb.finalized = false;
        return qb;
    }
    getKnex() {
        const tableName = this.helper.getTableName(this.entityName) + ([enums_1.QueryType.SELECT, enums_1.QueryType.COUNT].includes(this.type) ? ` as ${this.alias}` : '');
        const qb = this.knex(tableName);
        if (this.context) {
            qb.transacting(this.context);
        }
        return qb;
    }
    joinReference(field, alias, cond, type, path) {
        const [fromAlias, fromField] = this.helper.splitField(field);
        const entityName = this._aliasMap[fromAlias];
        const prop = this.metadata.get(entityName).properties[fromField];
        this._aliasMap[alias] = prop.type;
        cond = SmartQueryHelper_1.SmartQueryHelper.processWhere(cond, this.entityName, this.metadata.get(this.entityName));
        const aliasedName = `${fromAlias}.${prop.name}`;
        const ret = [];
        if (prop.reference === entity_1.ReferenceType.ONE_TO_MANY) {
            this._joins[aliasedName] = this.helper.joinOneToReference(prop, fromAlias, alias, type, cond);
        }
        else if (prop.reference === entity_1.ReferenceType.MANY_TO_MANY) {
            const pivotAlias = type === 'pivotJoin' ? alias : `e${this.aliasCounter++}`;
            const joins = this.helper.joinManyToManyReference(prop, fromAlias, alias, pivotAlias, type, cond);
            Object.assign(this._joins, joins);
            this._aliasMap[pivotAlias] = prop.pivotTable;
            ret.push(`${fromAlias}.${prop.name}`);
        }
        else if (prop.reference === entity_1.ReferenceType.ONE_TO_ONE) {
            this._joins[aliasedName] = this.helper.joinOneToReference(prop, fromAlias, alias, type, cond);
        }
        else { // MANY_TO_ONE
            this._joins[aliasedName] = this.helper.joinManyToOneReference(prop, fromAlias, alias, type, cond);
        }
        this._joins[aliasedName].path = path;
        return ret;
    }
    prepareFields(fields, type = 'where') {
        const ret = [];
        fields.forEach(f => {
            if (this._joins[f] && type === 'where') {
                return ret.push(...this.helper.mapJoinColumns(this.type, this._joins[f]));
            }
            ret.push(this.helper.mapper(f, this.type));
        });
        Object.keys(this._populateMap).forEach(f => {
            if (!fields.includes(f) && type === 'where') {
                ret.push(...this.helper.mapJoinColumns(this.type, this._joins[f]));
            }
            if (this._joins[f].prop.reference !== entity_1.ReferenceType.ONE_TO_ONE && this._joins[f].inverseJoinColumns) {
                this._joins[f].inverseJoinColumns.forEach(inverseJoinColumn => {
                    utils_1.Utils.renameKey(this._cond, inverseJoinColumn, `${this._joins[f].alias}.${inverseJoinColumn}`);
                });
            }
        });
        return ret;
    }
    init(type, data, cond) {
        this.type = type;
        this._aliasMap[this.alias] = this.entityName;
        if (data) {
            this._data = this.helper.processData(data);
        }
        if (cond) {
            this._cond = CriteriaNode_1.CriteriaNode.create(this.metadata, this.entityName, cond).process(this);
        }
        return this;
    }
    getQueryBase() {
        const qb = this.getKnex();
        if (this._schema) {
            qb.withSchema(this._schema);
        }
        switch (this.type) {
            case enums_1.QueryType.SELECT:
                qb.select(this.prepareFields(this._fields));
                if (this.flags.has(enums_1.QueryFlag.DISTINCT)) {
                    qb.distinct();
                }
                this.helper.processJoins(qb, this._joins);
                break;
            case enums_1.QueryType.COUNT:
                const m = this.flags.has(enums_1.QueryFlag.DISTINCT) ? 'countDistinct' : 'count';
                qb[m]({ count: this._fields.map(f => this.helper.mapper(f, this.type)) });
                this.helper.processJoins(qb, this._joins);
                break;
            case enums_1.QueryType.INSERT:
                qb.insert(this._data);
                break;
            case enums_1.QueryType.UPDATE:
                qb.update(this._data);
                this.helper.updateVersionProperty(qb);
                break;
            case enums_1.QueryType.DELETE:
                qb.delete();
                break;
            case enums_1.QueryType.TRUNCATE:
                qb.truncate();
                break;
        }
        return qb;
    }
    finalize() {
        if (this.finalized) {
            return;
        }
        this._populate.forEach(field => {
            const [fromAlias, fromField] = this.helper.splitField(field);
            const aliasedField = `${fromAlias}.${fromField}`;
            if (this._joins[aliasedField] && this.helper.isOneToOneInverse(field)) {
                return this._populateMap[aliasedField] = this._joins[aliasedField].alias;
            }
            if (this.metadata.has(field)) { // pivot table entity
                this.autoJoinPivotTable(field);
            }
            else if (this.helper.isOneToOneInverse(field)) {
                const prop = this.metadata.get(this.entityName).properties[field];
                this._joins[prop.name] = this.helper.joinOneToReference(prop, this.alias, `e${this.aliasCounter++}`, 'leftJoin');
                this._populateMap[field] = this._joins[field].alias;
            }
        });
        SmartQueryHelper_1.SmartQueryHelper.processParams([this._data, this._cond, this._having]);
        this.finalized = true;
    }
    autoJoinPivotTable(field) {
        const pivotMeta = this.metadata.get(field);
        const owner = Object.values(pivotMeta.properties).find(prop => prop.reference === entity_1.ReferenceType.MANY_TO_ONE && prop.owner);
        const inverse = Object.values(pivotMeta.properties).find(prop => prop.reference === entity_1.ReferenceType.MANY_TO_ONE && !prop.owner);
        const prop = this._cond[pivotMeta.name + '.' + owner.name] || this._orderBy[pivotMeta.name + '.' + owner.name] ? inverse : owner;
        const pivotAlias = this.getNextAlias();
        this._joins[field] = this.helper.joinPivotTable(field, prop, this.alias, pivotAlias, 'leftJoin');
        utils_1.Utils.renameKey(this._cond, `${field}.${owner.name}`, utils_1.Utils.getPrimaryKeyHash(owner.fieldNames.map(fieldName => `${pivotAlias}.${fieldName}`)));
        utils_1.Utils.renameKey(this._cond, `${field}.${inverse.name}`, utils_1.Utils.getPrimaryKeyHash(inverse.fieldNames.map(fieldName => `${pivotAlias}.${fieldName}`)));
        this._populateMap[field] = this._joins[field].alias;
    }
}
exports.QueryBuilder = QueryBuilder;
