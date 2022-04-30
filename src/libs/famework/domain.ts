import { Controller } from './controller'
import { EventHandler } from './event-handler';

export type Domain = {
	name: string,
	controllers: Controller[],
	eventHandlers?: Record<string, EventHandler>,
}

export const createDomain = (config: Domain) => {
	return config;
};
