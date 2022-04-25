import { Router } from 'express';

import type { Controller } from './controller';
import type { RequestMethod } from './http';
import { flattenEndpointsFromControllers } from './controller';

export const getRouterMethodFunction = (
	router: Router,
	method: Lowercase<RequestMethod>
) => {
	switch (method) {
		case 'delete': return router.delete;
		case 'post': return router.post;
		case 'put': return router.put;
		default: return router.get;
	}
}

export const buildRouter = (controllers: Controller[]) => {
	const flattenedEndpoints = flattenEndpointsFromControllers(controllers);
	const router = Router();

	return Object
		.entries(flattenedEndpoints)
		.reduce(
			(acc, [method, endpoints]) => {
				const routerFn = getRouterMethodFunction(
					acc,
					method as Lowercase<RequestMethod>
				);
				
				endpoints.forEach((endpoint) => {
					routerFn(endpoint.route, endpoint.handler);
					console.log(`ENDPOINT | [${method.toUpperCase()}] - ${endpoint.route} => init`);
				});

				return acc;
			},
			router
		);
}