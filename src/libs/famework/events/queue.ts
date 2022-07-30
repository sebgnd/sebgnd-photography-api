import type { Express } from 'express';

import { EventHandler, EventMessage, makeEventHandler } from './handler';
import type { EventDispatcher } from './dispatcher';

import { isEventMessage } from './handler';

import { EVENT_DISPATCHED, START_QUEUE } from './constant';

export type QueueInitialization = {
  app: Express,
  eventDispatcher: EventDispatcher,
  eventHandlers: Record<string, EventHandler[]>,
}

export type EventHandlersForQueue = {
  [eventName: string]: ReturnType<typeof makeEventHandler>[],
};

export type Queue = {
  flush: () => void,
}

export const initializeQueue = (initialization: QueueInitialization) => {
  const { app, eventDispatcher } = initialization;
  const eventHandlers = Object
    .entries(initialization.eventHandlers)
    .reduce((acc, [eventName, handlers]) => {
      console.log(`SYSTEM | Subscribe to ${eventName} event`);

      return {
        ...acc,
        [eventName]: handlers.map((handler) => makeEventHandler(handler, eventDispatcher)),
      };
    }, {} as EventHandlersForQueue);

  let executing = false;
  let queue: EventMessage[] = [];

  app.on(EVENT_DISPATCHED, (message: any) => {
    if (!isEventMessage(message)) {
      return;
    };

    queue.push(message);

    if (queue.length === 1 && !executing) {
      app.emit(START_QUEUE);
    }
  });

  // For now, execute one event at a time
  app.on(START_QUEUE, async () => {
    executing = true;

    console.log(`APPLICATION | Starting queue`);

    while (queue.length !== 0) {
      const eventMessage = queue.shift()!;
      const handlers = eventHandlers[eventMessage.name];

      console.log(`APPLICATION | Executing ${eventMessage.name}`);

      await Promise.all(
        handlers.map((handler) => handler(eventMessage)),
      );

      console.log(`APPLICATION | Finish executing ${eventMessage.name}`);
    }

    console.log(`APPLICATION | Stopping queue`);

    executing = false;
  });

  return {
    flush: () => {
      queue = [];
    },
  };
};
