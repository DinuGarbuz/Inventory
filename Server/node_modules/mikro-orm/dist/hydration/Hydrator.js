"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Hydrator {
    constructor(factory, em) {
        this.factory = factory;
        this.em = em;
    }
    hydrate(entity, meta, data, newEntity) {
        for (const prop of Object.values(meta.properties)) {
            this.hydrateProperty(entity, prop, data[prop.name], newEntity);
        }
    }
}
exports.Hydrator = Hydrator;
