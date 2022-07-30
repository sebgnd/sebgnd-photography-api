import { EventDispatcher } from './dispatcher';

export type EventHandler<T = any> = (data: T, eventDispatcher: EventDispatcher) => void | Promise<void>;

export type EventMessage<T = any> = {
  data: T,
  name: string,
};

export const isEventMessage = (message: any): message is EventMessage<any> => {
  return message.data !== undefined;
};

export const makeEventHandler = (handler: EventHandler, eventDispatcher: EventDispatcher) => {
  return async (message: EventMessage) => {
    const result = handler(message.data, eventDispatcher);

    if (result instanceof Promise) {
      await result;
    }
  };
};

