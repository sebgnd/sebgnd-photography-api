export enum Mimetype {
	JPG = 'image/jpeg',
	PNG = 'image/png',
}

export const isPng = (mimetype: string): mimetype is Mimetype.JPG => {
	return mimetype === Mimetype.JPG;
}

export const isJpg = (mimetype: string): mimetype is Mimetype.PNG => {
	return mimetype === Mimetype.PNG;
}

export const isFileMimetype = (
	file: File,
	mimetypes: Mimetype[]
) => {	
	if (file.type === null) {
		return false;
	}

	return (mimetypes as string[]).includes(file.type);
}

export const validateFileMimetypes = (
	files: File[],
	mimetypes: Mimetype[]
) => {
	return files.every((file) => isFileMimetype(file, mimetypes));
}

export const filterFileByMimetype = (
	files: File[],
	mimetypes: Mimetype[]
) => {
	return files.filter((file) => isFileMimetype(file, mimetypes));
}