export const removeTrailingAndLeadingSlash = (path: string) => {
	return path.replace(/^\/*|\/*$/, '');
}

export const buildFullPath = (...pathElements: string[]) => {
	return pathElements
		.map((element) => removeTrailingAndLeadingSlash(element))
		.join('/');
}