import type { Request, Response } from 'express';
import type { RequestMethod } from './http';

import { buildFullPath } from './path';
import { EventDispatcher, eventDispatcherBuilder } from './event-dispatcher';

export type EndpointHandler = (req: Request, res: Response) => void | Promise<void>;
export type Endpoint = {
	route: string,
	handler: EndpointHandler,
}

export type ControllerBuilderOptions = {
	handler: EndpointHandler,
};

export type ControllerBuilder = {
	post: (endpoint: string, options: Omit<ControllerBuilderOptions, 'method'>) => ControllerBuilder,
	get: (endpoint: string, options: Omit<ControllerBuilderOptions, 'method'>) => ControllerBuilder,
	put: (endpoint: string, options: Omit<ControllerBuilderOptions, 'method'>) => ControllerBuilder,
	delete: (endpoint: string, options: Omit<ControllerBuilderOptions, 'method'>) => ControllerBuilder,
};

export type CreateControllerCallbackOptions = {
	builder: ControllerBuilder,
	eventDispatcher: EventDispatcher,
};
export type CreateControllerCallback = (options: CreateControllerCallbackOptions) => void;

export type Controller = {
	name: string,
	getEndpoints: () => Record<Lowercase<RequestMethod>, Endpoint[]>,
	init: () => void;
};

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

export type ControllerBuildingContext = {
	endpoints: Record<Lowercase<RequestMethod>, Endpoint[]>,
	getBuilder: () => ControllerBuilder,
}

export const makeControllerHandler = (
	method: Lowercase<RequestMethod>,
	controllerName: string,
	context: ControllerBuildingContext
) => {
	return (endpoint: string, options: ControllerBuilderOptions) => {
		const { handler } = options;
		const { endpoints, getBuilder } = context;

		endpoints[method].push({
			route: buildFullPath(controllerName, endpoint),
			handler,
		});

		return getBuilder();
	}
}

export const createController = (
	name: string,
	callback: CreateControllerCallback
) => {
	let initialized = false;

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
		getEndpoints: () => {
			if (!initialized) {
				throw new Error('Cannot get endpoints before initialization');
			}

			return endpoints;
		},
		init: () => {
			if (initialized) {
				return;
			}

			callback({
				builder,
				eventDispatcher: eventDispatcherBuilder.build(),
			});
			initialized = true;
		}
	}

	return controller;
}