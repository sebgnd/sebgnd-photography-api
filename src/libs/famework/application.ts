import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import type { Request, Response, NextFunction } from 'express';

import { buildRouter } from './build-router';
import { removeTrailingAndLeadingSlash } from './path';
import { executeFunctionOrPromise } from '../utils/function';
import { initEventDispatcher } from './event-dispatcher';
import { Domain } from './domain';
import { Controller } from './controller';
import { EventHandler, makeEventHandler } from './event-handler';

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export type ApplicationConfig = {
	port?: number;
	routePrefix?: string,
	domains: Domain[],
	middlewares?: Middleware[],
	afterStart?: () => void | Promise<void>;
	beforeStart?: () => any;
};

export type DomainEvent = {
	events: Set<string>,
	handlers: Record<string, EventHandler[]>,
}

export const createApplication = (config: ApplicationConfig) => {
	console.log('SYSTEM | Application initialization started');
	const port = config.port || 8000;
	const middlewares = config.middlewares || [];
	const routePrefix = config.routePrefix || 'api';

	const { domains } = config;
	const controllers = domains.reduce(
		(acc, domain) => {
			return [...acc, ...domain.controllers]; 
		},
		[] as Controller[]
	);
	const { events, handlers } = domains.reduce(
		(domainEvent, domain) => {
			return Object
				.entries((domain.eventHandlers || {}))
				.reduce((acc, [eventName, handler]) => {
					const handlersForEvent = acc.handlers[eventName];
					const handlersWithCurrent = handlersForEvent
						? [...handlersForEvent, handler]
						: [handler];

					return {
						events: new Set([...acc.events, eventName]),
						handlers: {
							...acc.handlers,
							[eventName]: handlersWithCurrent,
						},
					}
				}, domainEvent);
		},
		{ events: new Set<string>(), handlers: {} } as DomainEvent,
	);

	return {
		start: async () => {
			const expressInstance = express();
			const expressServer = http.createServer(expressInstance);
			const socketServer = new Server(expressServer);

			await executeFunctionOrPromise(() => config.beforeStart?.());

			const eventDispatcher = initEventDispatcher(expressInstance, socketServer);
			const router = buildRouter(controllers, eventDispatcher);
			const prefix = removeTrailingAndLeadingSlash(routePrefix);

			middlewares?.forEach((middleware) => {
				expressInstance.use(middleware);
			});
			
			events.forEach((event) => {
				console.log(`SYSTEM | Subscribe to ${event} event`);

				handlers[event].forEach((handler) => {
					expressInstance.on(event, makeEventHandler(handler, eventDispatcher));
				});
			});
			expressInstance.use(`/${prefix}`, router);
			socketServer.on('connection', (socket) => {
				console.log(`APPLICATION | user ${socket.id} connected`);
				socket.on('disconnect', () => {
					console.log(`APPLICATION | user ${socket.id} disconnected`);
				});
			});
			expressServer.listen(port, async () => {
        await executeFunctionOrPromise(() => config.afterStart?.());

				console.log(`SYSTEM | Application started on port ${port}`)
			});
		},
	}
}
