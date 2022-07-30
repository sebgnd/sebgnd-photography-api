import type { Optionnal } from '@libs/types';

export type TransformerFn<A, B> = (value: A) => B;

export const executeFunctionOrPromise = async (
  fnOrPromise: () => any,
) => {
  const result = fnOrPromise();

  if (result instanceof Promise) {
    return result;
  }

  return Promise.resolve(result);
};

export const isUndefined = (value: any): value is undefined => value === undefined;
export const isNull = (value: any): value is null => value === null;

export const transformOrNull = <Input, Output>(
  value: Optionnal<Input>,
  transformer: TransformerFn<Input, Output>,
) => {
  if (isNull(value) || isUndefined(value)) {
    return null;
  }

  return transformer(value);
};
