import express from 'express';
import type { Router } from 'express';

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
	const router = express.Router();

	return Object
		.entries(flattenedEndpoints)
		.reduce(
			(acc, [method, endpoints]) => {				
				endpoints.forEach((endpoint) => {
					/**
					 * Temporary, making a function to get the right
					 * router function does not work for some reason
					 */
					(router as any)[method](endpoint.route, endpoint.handler);

					console.log(`ENDPOINT | [${method.toUpperCase()}] - ${endpoint.route} => init`);
				});

				return acc;
			},
			router
		);
}