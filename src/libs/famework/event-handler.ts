import { Application } from 'express';
import { EventDispatcher } from './event-dispatcher';

export type EventHandler<T = any> = (data: T, eventDispatcher: EventDispatcher) => void | Promise<void>

export type EventMessage<T> = {
	data: T,
};

export const isEventMessage = (message: any): message is EventMessage<any> => {
	return message.data !== undefined;
}

export const makeEventHandler = (handler: EventHandler, eventDispatcher: EventDispatcher) => {
	return (message: Application) => {
		if (isEventMessage(message)) {
			return handler(message.data, eventDispatcher);
		}

		return () => {};
	}
}
