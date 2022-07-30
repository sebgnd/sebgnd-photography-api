import { Controller } from './controller';
import { EventHandler } from './events/handler';

export type Domain = {
  name: string,
  controllers: Controller[],
  eventHandlers?: Record<string, EventHandler>,
  init?: () => Promise<void>,
};

export type CombinedDomain = {
  eventHandlers: {
    [eventName: string]: EventHandler[],
  },
  events: Set<string>,
  controllers: Controller[],
};

export const createDomain = (config: Domain) => {
  return config;
};

export const combineDomains = (domains: Domain[]) => {
  return domains.reduce((combined: CombinedDomain, currentDomain) => {
    return {
      controllers: [
        ...combined.controllers,
        ...currentDomain.controllers,
      ],
      events: new Set(
        ...combined.events,
        ...Object.keys(currentDomain.eventHandlers || {}),
      ),
      eventHandlers: Object
        .entries(currentDomain.eventHandlers || {})
        .reduce((acc, [eventName, eventHandler]) => {
          return {
            ...acc,
            [eventName]: acc[eventName]
              ? [...acc[eventName], eventHandler]
              : [eventHandler],
          };
        }, combined.eventHandlers),
    };
  }, {
    eventHandlers: {},
    events: new Set<string>(),
    controllers: [],
  });
};
