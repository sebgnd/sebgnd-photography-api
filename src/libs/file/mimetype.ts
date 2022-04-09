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