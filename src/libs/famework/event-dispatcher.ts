import { Express } from 'express';

export type EventDispatcher = {
	dispatch: <T = any>(eventName: string, message: T) => void,
}

export const createEventDispatcherBuilder = () => {
	let builtEventDispatchers: Record<string, EventDispatcher> = {};
	let injectedApp: Express | null = null;

	return {
		injectApp: (app: Express) => {
			injectedApp = app;
		},
		build: (scope: string = 'global'): EventDispatcher => {
			if (!injectedApp) {
				throw new Error('Canont create event dispatcher without application initialization');
			}

			if (builtEventDispatchers[scope]) {
				return builtEventDispatchers[scope];
			}

			console.log(`SYSTEM | Event dispatcher for scope ${scope} initialized`)

			builtEventDispatchers[scope] = {
				dispatch: <T = any>(eventName: string, data: T) => {
					injectedApp?.emit(eventName, {
						scope,
						data,
					});
				},
			};

			return builtEventDispatchers[scope];
		},
	};
}

export const eventDispatcherBuilder = createEventDispatcherBuilder();