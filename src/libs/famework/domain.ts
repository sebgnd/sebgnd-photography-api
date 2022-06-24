import { Controller } from './controller'
import { EventHandler } from './event-handler';

export type Domain = {
	name: string,
	controllers: Controller[],
	eventHandlers?: Record<string, EventHandler>,
	init?: () => Promise<void>,
}

export const createDomain = (config: Domain) => {
	return config;
};
