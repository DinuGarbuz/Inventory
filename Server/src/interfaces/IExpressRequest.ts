import { Request } from "express";
import { EntityManager } from "mikro-orm";

export interface IExpressRequest extends Request {
    em?: EntityManager;
}