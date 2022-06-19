import * as fs from 'fs'
import * as path from 'path';
import * as utils from 'util';

export type ImageFormat = 'thumbnail' | 'full';
export type ImageSize = '400' | '1080' | '80' | 'original';

export const availableFormats: ImageFormat[] = ['thumbnail', 'full'];
export const availableSizes: ImageSize[] = ['400', '1080', '80', 'original'];

export type ImagePathConfig = {
	format: ImageFormat,
	size: ImageSize,
};

const deleteFile = utils.promisify(fs.unlink);
const copyFile = utils.promisify(fs.copyFile);

export const validFormatAndSize = (format: string, size: string) => {
	return availableFormats.includes(format as any) || availableSizes.includes(size as any);
}

export const buildImagePath = (imageId: string, format: ImageFormat, size: ImageSize) => {
	return path.join('files', 'images', format, size, imageId) + '.jpg';
}

export const getImagePathIfExist = (imageId: string, config: ImagePathConfig) => {
	const { format, size } = config;

	const imagePath = buildImagePath(imageId, format, size);
	const imagePathExist = fs.existsSync(imagePath);

	if (imagePathExist) {
		return imagePath;
	}

	return null;
}

export const copyOriginalImage = async (imageId: string, temporaryPath: string) => {
	const oldPath = temporaryPath;
	const newPath = buildImagePath(imageId, 'full', 'original');

	await copyFile(oldPath, newPath);
}

export const deleteImage = async (imageId: string) => {
	await Promise.all(
		availableFormats.reduce((acc, format) => {
			return [
				...acc,
				...availableSizes.map(async (size) => {
					console.log(`APPLICATION | Deleting ${format}/${size} of ${imageId}`);

					await deleteFile(
						buildImagePath(imageId, format, size),
					);
				}),
			]
		}, [] as Promise<void>[])
	);
}
