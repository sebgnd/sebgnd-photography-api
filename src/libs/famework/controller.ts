import type { Request, Response, NextFunction } from 'express';
import type { RequestMethod } from './http';
import type { Middleware } from './types';

import { buildFullPath } from './path';
import { EventDispatcher } from './event-dispatcher';

export type EndpointHandler = (req: Request, res: Response) => void | Promise<void>;
export type Endpoint = {
	route: string,
	middlewares: Middleware[],
	handler: EndpointHandler,
}

/**
 * TODO: Handle automatic request param parsing + error handling
 */
export type ControllerBuilderOptions = {
	middlewares?: Middleware[],
	handler: EndpointHandler,
};

export type ControllerBuilder = {
	post: (endpoint: string, options: ControllerBuilderOptions) => ControllerBuilder,
	get: (endpoint: string, options: ControllerBuilderOptions) => ControllerBuilder,
	put: (endpoint: string, options: ControllerBuilderOptions) => ControllerBuilder,
	delete: (endpoint: string, options: ControllerBuilderOptions) => ControllerBuilder,
};

export type CreateControllerCallbackOptions = {
	builder: ControllerBuilder,
	eventDispatcher: EventDispatcher,
};

export type CreateControllerCallback = (options: CreateControllerCallbackOptions) => void;

export type ControllerInitializationConfig = {
	eventDispatcher: EventDispatcher,
}

export type Controller = {
	name: string,
	getEndpoints: () => Record<Lowercase<RequestMethod>, Endpoint[]>,
	init: (config: ControllerInitializationConfig) => void;
};

export type ControllerBuildingContext = {
	endpoints: Record<Lowercase<RequestMethod>, Endpoint[]>,
	getBuilder: () => ControllerBuilder,
}

export const flattenEndpointsFromControllers = (
	controllers: Controller[]
) => {
	const initialValue: Record<Lowercase<RequestMethod>, Endpoint[]> = {
		get: [],
		post: [],
		put: [],
		delete: [],
	};
	return controllers.reduce(
		(acc, controller) => {
			const endpoints = controller.getEndpoints();
			return {
				get: [...acc.get, ...endpoints.get],
				post: [...acc.post, ...endpoints.post],
				delete: [...acc.delete, ...endpoints.delete],
				put: [...acc.put, ...endpoints.put],
			}
		},
		initialValue,
	);
};

export const makeControllerHandler = (
	method: Lowercase<RequestMethod>,
	controllerName: string,
	context: ControllerBuildingContext
) => {
	return (endpoint: string, options: ControllerBuilderOptions) => {
		const { handler, middlewares } = options;
		const { endpoints, getBuilder } = context;

		endpoints[method].push({
			route: buildFullPath(controllerName, endpoint),
			middlewares: middlewares ?? [],
			handler,
		});

		return getBuilder();
	}
}

export const createController = (
	name: string,
	callback: CreateControllerCallback
) => {
	const endpoints: Record<Lowercase<RequestMethod>, Endpoint[]> = {
		get: [],
		post: [],
		put: [],
		delete: [],
	};

	const builder: ControllerBuilder = {
		post: makeControllerHandler('post', name, {
			getBuilder: () => builder,
			endpoints
		}),
		get: makeControllerHandler('get', name, {
			getBuilder: () => builder,
			endpoints
		}),
		delete: makeControllerHandler('delete', name, {
			getBuilder: () => builder,
			endpoints
		}),
		put: makeControllerHandler('put', name, {
			getBuilder: () => builder,
			endpoints
		}),
	};

	const controller: Controller = {
		name,
		getEndpoints: () => endpoints,
		init: (config: ControllerInitializationConfig) => {
			callback({
				builder,
				eventDispatcher: config.eventDispatcher,
			});
		}
	}

	return controller;
}