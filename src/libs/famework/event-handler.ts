import { Application } from "express";

export type EventHandler<T = any> = (data: T) => void | Promise<void>

export type EventMessage<T> = {
	scope: string,
	data: T,
};

export const isEventMessage = (message: any): message is EventMessage<any> => {
	return message.data && typeof message.scope === 'string';
}

export const makeEventHandler = (handler: EventHandler) => {
	return (message: Application) => {
		if (isEventMessage(message)) {
			return handler(message.data);
		}

		return () => {};
	}
}
