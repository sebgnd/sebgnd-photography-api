import { Express } from 'express';
import { Server as ServerIO } from 'socket.io';

export type ServerInjection = {
	app: Express,
	io: ServerIO,
}

export enum Locality {
	WIDE,
	INTERNAL,
	EXTERNAL,
};

export type DispatchedEvent<T> = {
	name: string,
	locality: Locality,
	data: T,
}

export type EventDispatcher = {
	dispatch: <T = any>(event: DispatchedEvent<T>) => void,
}

export const initEventDispatcher = (app: Express, io: ServerIO): EventDispatcher => {
	return {
		dispatch: <T = any>(event: DispatchedEvent<T>) => {
			const { name, data, locality } = event;

			if (locality === Locality.WIDE || locality === Locality.INTERNAL) {
				app.emit(name, {
					data,
				});
			}

			if (locality === Locality.WIDE || locality === Locality.EXTERNAL) {
				io.emit(name, {
					data
				});
			}
		},
	}
}
