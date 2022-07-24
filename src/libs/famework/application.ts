import express, { Express } from 'express';
import * as http from 'http';
import { Server } from 'socket.io';

import { executeFunctionOrPromise } from '@libs/utils/function';

import { combineDomains } from './domain';
import { buildRouter } from './router';
import { removeTrailingAndLeadingSlash } from './http/path';
import { initEventDispatcher } from './events/dispatcher';
import { makeEventHandler } from './events/handler';

import type { EventDispatcher } from './events/dispatcher';
import type { Domain } from './domain';
import type { EventHandler } from './events/handler';
import type { Middleware } from './types';
import { initializeQueue } from './events/queue';


export type ApplicationConfig = {
	port?: number;
	routePrefix?: string,
	domains: Domain[],
	middlewares?: Middleware[],
	afterStart?: () => void | Promise<void>;
	beforeStart?: () => void | Promise<void>;
};

export type DomainEvent = {
	events: Set<string>,
	handlers: Record<string, EventHandler[]>,
}

export const applyMiddlewares = (app: Express, middlewares: Middleware[]) => {
	middlewares.forEach((middleware) => {
		app.use(middleware);
	}) 
}

export const createApplication = (config: ApplicationConfig) => {
	console.log('SYSTEM | Application initialization started');
	console.log(process.env.AWS_S3_BUCKET);
	console.log(process.env.NODE_ENV);
	console.log(process.env.PORT);

	const port = config.port || 8000;
	const middlewares = config.middlewares || [];
	const routePrefix = config.routePrefix || 'api';
	const { domains } = config;

	const { controllers, eventHandlers } = combineDomains(domains);

	return {
		start: async () => {
			const expressInstance = express();
			const expressServer = http.createServer(expressInstance);
			const socketServer = new Server(expressServer, {
				cors: {
					origin: 'http://localhost:3000',
					methods: ['GET', 'POST'],
				}
			});

			await Promise.all([
				executeFunctionOrPromise(() => config.beforeStart?.()),
				...domains.map(async (domain) => {
					return domain.init?.();
				}),
			]);

			await executeFunctionOrPromise(() => config.beforeStart?.());

			const eventDispatcher = initEventDispatcher(expressInstance, socketServer);
			const router = buildRouter(controllers, eventDispatcher);
			const prefix = removeTrailingAndLeadingSlash(routePrefix);

			applyMiddlewares(expressInstance, middlewares || []);
			initializeQueue({
				app: expressInstance,
				eventHandlers,
				eventDispatcher,
			})

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
