import * as express from "express";
import { env } from "./env";
import { setAJsonRoute } from "./routes/a-json.route";
import { setInventoryItemRoute } from "./routes/inventory-item.route";
import { setDiscoveryClientRoute } from "./routes/discovery-client.route";
import { IExpressError } from "./interfaces/IExpressError";
import { MikroORM, ReflectMetadataProvider } from "mikro-orm";
import entities from "./entities";
import { IExpressRequest } from "./interfaces/IExpressRequest";
import * as bodyParser from "body-parser";

let app: express.Application;

async function makeApp(): Promise<express.Application>  {
	if (app) return app;

	app = express();

	const orm = await MikroORM.init({
        metadataProvider: ReflectMetadataProvider,
        cache: { enabled: false },
        entities: entities,
        dbName: env.DB_NAME,
        clientUrl: env.MONGO_URL,
        type: "mongo",
        autoFlush: false
	});

	// make the entity manager available in request
	app.use((req: IExpressRequest, _res: express.Response, next: express.NextFunction) => {
		req.em = orm.em.fork();
		next();
	});

	// middleware
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	// routes
	app.use(env.DISCOVERY_CLIENT_ROUTE, setDiscoveryClientRoute(express.Router()));
	app.use(env.A_JSON_ROUTE, setAJsonRoute(express.Router()));
	app.use(env.INVENTORY_ITEM_ROUTE, setInventoryItemRoute(express.Router()));

	// 404
	app.use((_req, _res, next) => {
		const err = new Error("Not Found") as IExpressError;
		err.status = 404;
		next(err);
	});

	// 500
	app.use((err: IExpressError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
		res.status(err.status || 500)
			.send(err.message);
	});

	return app;
}

export { makeApp }