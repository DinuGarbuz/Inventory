import { AJson } from "../entities/a-json.entity";
import { EntityManager } from "mikro-orm";

export { getAJson, saveAJson };

async function getAJson(em: EntityManager, key1: string): Promise<Error | AJson | null> {
    if (!(em instanceof EntityManager))
        return Error("invalid request");

    if (!key1 || typeof key1 !== "string")
        return Error("invalid params");

    try {
        const aJson = await em.findOne(AJson, { key1 });
        return aJson;
    } catch (ex) {
        return ex;
    }
}

async function saveAJson(em: EntityManager, aJson: Partial<AJson>): Promise<Error | AJson> {
    if (!(em instanceof EntityManager))
        return Error("invalid request");

    if (!aJson || typeof aJson !== "object" || !aJson.key1)
        return Error("invalid params");

    try {
        const aJsonExists = await em.findOne(AJson, { key1: aJson.key1 });
        if (aJsonExists)
            return Error("item already exists");
    } catch (ex) {
        return ex;
    }

    const jsonModel = new AJson({
        key1: aJson.key1,
        "key 2": aJson["key 2"]
    });

    try {
        await em.persistAndFlush([jsonModel]);
    } catch (ex) {
        return ex;
    }

    return jsonModel;
}