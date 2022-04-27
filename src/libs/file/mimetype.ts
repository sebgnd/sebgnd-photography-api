export enum Mimetype {
	JPG = 'image/jpeg',
	PNG = 'image/png',
}

export type WithMimetype = {
	mimetype: string | null,
};

export const isPng = (mimetype: string): mimetype is Mimetype.JPG => {
	return mimetype === Mimetype.JPG;
}

export const isJpg = (mimetype: string): mimetype is Mimetype.PNG => {
	return mimetype === Mimetype.PNG;
}

export const isFileMimetype = <File extends WithMimetype>(
	file: File,
	mimetypes: Mimetype[]
) => {	
	if (file.mimetype === null) {
		return false;
	}

	return (mimetypes as string[]).includes(file.mimetype);
}

export const validateFileMimetypes = <File extends WithMimetype>(
	files: File[],
	mimetypes: Mimetype[]
) => {
	return files.every((file) => isFileMimetype(file, mimetypes));
}

export const filterFileByMimetype = <File extends WithMimetype>(
	files: File[],
	mimetypes: Mimetype[]
) => {
	return files.filter((file) => isFileMimetype(file, mimetypes));
}