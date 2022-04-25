import type { Request, Response } from 'express';
import type { RequestMethod } from './http';

import { buildFullPath } from './path';

export type EndpointHandler = <T>(req: Request, res: Response) => void | T;
export type Endpoint = {
	route: string,
	handler: EndpointHandler,
}

export type ControllerBuilderOptions = {
	handler: EndpointHandler,
	method: RequestMethod,
};

export type ControllerBuilder = {
	request: (endpoint: string, options: ControllerBuilderOptions) => void,
	post: (endpoint: string, options: Omit<ControllerBuilderOptions, 'method'>) => void,
	get: (endpoint: string, options: Omit<ControllerBuilderOptions, 'method'>) => void,
	put: (endpoint: string, options: Omit<ControllerBuilderOptions, 'method'>) => void,
	delete: (endpoint: string, options: Omit<ControllerBuilderOptions, 'method'>) => void,
};

export type CreateControllerCallbackOptions = {
	builder: ControllerBuilder,
};
export type CreateControllerCallback = (options: CreateControllerCallbackOptions) => void;

export type Controller = {
	name: string,
	endpoints: Record<Lowercase<RequestMethod>, Endpoint[]>,
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
			const { endpoints } = controller;
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
		request: (endpoint: string, options: ControllerBuilderOptions) => {
			const { method, handler } = options;
			const loweredMethod = method.toLowerCase() as Lowercase<RequestMethod>;

			endpoints[loweredMethod].push({
				route: buildFullPath(name, endpoint),
				handler,
			});

			return builder;
		},
		post: (endpoint: string, options: Omit<ControllerBuilderOptions, 'method'>) => builder.request(endpoint, {
			...options,
			method: 'post',
		}),
		get: (endpoint: string, options: Omit<ControllerBuilderOptions, 'method'>) => builder.request(endpoint, {
			...options,
			method: 'get',
		}),
		delete: (endpoint: string, options: Omit<ControllerBuilderOptions, 'method'>) => builder.request(endpoint, {
			...options,
			method: 'delete',
		}),
		put: (endpoint: string, options: Omit<ControllerBuilderOptions, 'method'>) => builder.request(endpoint, {
			...options,
			method: 'put',
		}),
	};

	callback({ builder });

	const controller: Controller = {
		name,
		endpoints,
	}

	return controller;
}