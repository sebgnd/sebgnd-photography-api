export const removeTrailingAndLeadingSlash = (path: string) => {
	return path.replace(/^\/*|\/*$/, '');
}

export const buildFullPath = (...pathElements: string[]) => {
	const path = pathElements
		.map((element) => removeTrailingAndLeadingSlash(element))
		.join('/');

	return `/${path}`;
}