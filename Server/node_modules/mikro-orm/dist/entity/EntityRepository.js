"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntityRepository {
    constructor(em, entityName) {
        this.em = em;
        this.entityName = entityName;
    }
    persist(entity, flush = this.em.config.get('autoFlush')) {
        return this.em.persist(entity, flush);
    }
    async persistAndFlush(entity) {
        await this.em.persistAndFlush(entity);
    }
    persistLater(entity) {
        this.em.persistLater(entity);
    }
    createQueryBuilder(alias) {
        return this.em.createQueryBuilder(this.entityName, alias);
    }
    async findOne(where, populate = [], orderBy) {
        return this.em.findOne(this.entityName, where, populate, orderBy);
    }
    async findOneOrFail(where, populate = [], orderBy) {
        return this.em.findOneOrFail(this.entityName, where, populate, orderBy);
    }
    async find(where, populate = [], orderBy = {}, limit, offset) {
        return this.em.find(this.entityName, where, populate, orderBy, limit, offset);
    }
    async findAndCount(where, populate = [], orderBy = {}, limit, offset) {
        return this.em.findAndCount(this.entityName, where, populate, orderBy, limit, offset);
    }
    async findAll(populate = [], orderBy, limit, offset) {
        return this.em.find(this.entityName, {}, populate, orderBy, limit, offset);
    }
    remove(where, flush = this.em.config.get('autoFlush')) {
        return this.em.remove(this.entityName, where, flush);
    }
    async removeAndFlush(entity) {
        await this.em.removeAndFlush(entity);
    }
    removeLater(entity) {
        this.em.removeLater(entity);
    }
    async flush() {
        return this.em.flush();
    }
    async nativeInsert(data) {
        return this.em.nativeInsert(this.entityName, data);
    }
    async nativeUpdate(where, data) {
        return this.em.nativeUpdate(this.entityName, where, data);
    }
    async nativeDelete(where) {
        return this.em.nativeDelete(this.entityName, where);
    }
    map(result) {
        return this.em.map(this.entityName, result);
    }
    async aggregate(pipeline) {
        return this.em.aggregate(this.entityName, pipeline);
    }
    getReference(id, wrapped = false) {
        return this.em.getReference(this.entityName, id, wrapped);
    }
    canPopulate(property) {
        return this.em.canPopulate(this.entityName, property);
    }
    async populate(entities, populate, where = {}, orderBy = {}, refresh = false, validate = true) {
        return this.em.populate(entities, populate, where, orderBy, refresh, validate);
    }
    /**
     * Creates new instance of given entity and populates it with given data
     */
    create(data) {
        return this.em.create(this.entityName, data);
    }
    async count(where = {}) {
        return this.em.count(this.entityName, where);
    }
}
exports.EntityRepository = EntityRepository;
