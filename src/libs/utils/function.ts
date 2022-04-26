export const executeFunctionOrPromise = async (
	fnOrPromise: () => any
) => {
	const result = fnOrPromise();

	if (result instanceof Promise) {
		return result;
	}

	return Promise.resolve(result);
}