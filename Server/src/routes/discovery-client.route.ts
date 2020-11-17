import { Router, Request, Response, NextFunction } from "express";
import { env } from "../env";

function setDiscoveryClientRoute(router: Router): Router {
	router.get("/", getdiscoveryClient);

	return router;
}

function getdiscoveryClient(_req: Request, res: Response, next: NextFunction) {
	try {
		const clientSettings = {
			jsonRoute: env.A_JSON_ROUTE
		};
		return res.json(clientSettings);
	} catch (ex) {
		return next(ex);
	}
}

export { setDiscoveryClientRoute }
