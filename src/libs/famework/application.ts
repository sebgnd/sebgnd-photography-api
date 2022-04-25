import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { Controller } from './controller';
import { buildRouter } from './build-router';
import { removeTrailingAndLeadingSlash } from './path';

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export type ApplicationConfig = {
	port?: number;
	routePrefix?: string,
	controllers: Controller[],
	middlewares?: Middleware[],
	afterStart?: () => void;
	beforeStart?: () => void;
};

export const createApplication = (config: ApplicationConfig) => {
	const port = config.port || 8000;
	const middlewares = config.middlewares || [];
	const routePrefix = config.routePrefix || 'api';

	const { controllers } = config;
	const expressInstance = express();

	middlewares?.forEach((middleware) => {
		expressInstance.use(middleware);
	});

	return {
		instance: expressInstance,
		start: async () => {
			const router = buildRouter(controllers);
			const prefix = removeTrailingAndLeadingSlash(routePrefix);

			config.beforeStart?.();

			expressInstance.use(`/${prefix}/`, router);
			expressInstance.listen(port, () => {
				config.afterStart?.();
				console.log(`SYSTEM | Application started on port ${port}`)
			});
		},
	}
}
