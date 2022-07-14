import express from 'express';
import type { Router } from 'express';

import type { Controller } from './controller';
import type { RequestMethod } from './http/http';
import { flattenEndpointsFromControllers } from './controller';
import { EventDispatcher } from './events/dispatcher';

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

export const buildRouter = (controllers: Controller[], eventDispatcher: EventDispatcher) => {
	const router = express.Router();

	controllers.forEach((controller) => {
		controller.init({ eventDispatcher });
	});

	const flattenedEndpoints = flattenEndpointsFromControllers(controllers);

	return Object
		.entries(flattenedEndpoints)
		.reduce(
			(acc, [method, endpoints]) => {				
				endpoints.forEach((endpoint) => {
					const { route, handler, middlewares } = endpoint;
					/**
					 * Temporary, making a function to get the right
					 * router function does not work for some reason
					 */
					(router as any)[method](route, ...middlewares, handler);

					console.log(`ENDPOINT | [${method.toUpperCase()}] - ${endpoint.route} initialized`);
				});

				return acc;
			},
			router
		);
}