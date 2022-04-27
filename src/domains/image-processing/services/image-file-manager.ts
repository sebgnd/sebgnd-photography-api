import * as fs from 'fs'
import * as path from 'path';

export type ImageFormat = 'thumbnail' | 'full';
export type ImageSize = '400' | '1080' | '80' | 'original';

export const availableFormats = ['thumbnail', 'full'];
export const availableSizes = ['400', '1080', '80', 'original'];

export type ImagePathConfig = {
	format: ImageFormat,
	size: ImageSize,
};

export const validFormatAndSize = (format: string, size: string) => {
	return availableFormats.includes(format) || availableSizes.includes(size);
}

export const getImagePathIfExist = (imageId: string, config: ImagePathConfig) => {
	const { format, size } = config;

	const imagePath = path.join('files', 'images', format, size, imageId) + '.jpg';
	const imagePathExist = fs.existsSync(imagePath);

	if (imagePathExist) {
		return imagePath;
	}

	return null;
}