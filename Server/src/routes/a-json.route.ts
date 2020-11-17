import { Router, Response, NextFunction } from "express";
import { EntityManager } from "mikro-orm";
import { AJson } from "../entities/a-json.entity";
import { IExpressRequest } from "../interfaces/IExpressRequest";
import * as jsonService from "../services/a-json.service";

export { setAJsonRoute };

function setAJsonRoute(router: Router): Router {
    router.get("/:key1", getAJson);
    router.post("/", postAJson);

    return router;
}

async function getAJson(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.em || !(req.em instanceof EntityManager))
        return next(Error("EntityManager not available"));

    let aJson: Error | AJson | null;
    try {
        aJson = await jsonService.getAJson(req.em, req.params.key1 as string);
    } catch (ex) {
        return next(ex);
    }

    if (aJson instanceof Error)
        return next(aJson);

    if (aJson === null)
        return res.status(404).end();

    return res.json(aJson);
}

async function postAJson(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.em || !(req.em instanceof EntityManager))
        return next(Error("EntityManager not available"));

    let aJson: Error | AJson;
    try {
        aJson = await jsonService.saveAJson(req.em, req.body);
    } catch (ex) {
        return next(ex);
    }

    if (aJson instanceof Error)
        return next(aJson);

    return res.status(201).json(aJson);
}