import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { Controller } from './controller';
import { buildRouter } from './build-router';
import { removeTrailingAndLeadingSlash } from './path';
import { executeFunctionOrPromise } from '../utils/function';
import { eventDispatcherBuilder } from './event-dispatcher';

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export type ApplicationConfig = {
	port?: number;
	routePrefix?: string,
	controllers: Controller[],
	middlewares?: Middleware[],
	afterStart?: () => void | Promise<void>;
	beforeStart?: () => any;
};

export const createApplication = (config: ApplicationConfig) => {
	console.log('SYSTEM | Application initialization started');

	let initialized = false;

	const port = config.port || 8000;
	const middlewares = config.middlewares || [];
	const routePrefix = config.routePrefix || 'api';

	const { controllers } = config;
	const expressInstance = express();

	eventDispatcherBuilder.injectApp(expressInstance);

	middlewares?.forEach((middleware) => {
		expressInstance.use(middleware);
	});

	return {
		instance: expressInstance,
		start: async () => {
			const router = buildRouter(controllers);
			const prefix = removeTrailingAndLeadingSlash(routePrefix);

			await executeFunctionOrPromise(() => config.beforeStart?.());

			expressInstance.use(`/${prefix}`, router);
			expressInstance.listen(port, async () => {
        await executeFunctionOrPromise(() => config.afterStart?.());

				initialized = true;

				console.log(`SYSTEM | Application started on port ${port}`)
			});
		},
	}
}
