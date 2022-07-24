import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

export type ImageVersionConfig = {
	initialImagePath: string,
	thumbnail: {
		/**
		 * The thumbnail is a square. Its height is
		 * the same as its width.
		 */
		heights: number[],
		imageHandler: (buffer: Buffer, height: number) => Promise<void>,
	},
	full: {
		/**
		 * The width will be determined automatically.
		 * The final image will have the same aspect ratio
		 * as the original image.
		 */
		heights: number[],
		imageHandler: (buffer: Buffer, height: number) => Promise<void>,
	},
}

export type ImageInfo = {
	originalHeight: number,
	originalWIdth: number,
	resizedWidth: number,
	resizedHeight: number,
	thumbnailSize: number,
}

export const getCenterCroppedCoordinatesForThumbnail = (info: ImageInfo) => {
	const { thumbnailSize, resizedHeight, resizedWidth } = info;

	const isLandscape = info.originalHeight < info.originalWIdth;

	const x = isLandscape ? (resizedWidth / 2) - (thumbnailSize / 2) : 0; 
	const y = isLandscape ? 0 : (resizedHeight / 2) - (thumbnailSize / 2);

	return { x, y }
};

export const convertImageToJpg = async (imagePath: string) => {
	const imageExist = fs.existsSync(imagePath);

	if (!imageExist) {
		throw new Error('Invalid path');
	}

	const imageDirectory = path.dirname(imagePath);
	const [imageName, extension] = path.basename(imagePath).split('.');

	if (extension === 'jpg' || extension === 'jpeg') {
		return imagePath;
	}

	const jpgImage = await sharp(imagePath)
		.jpeg()
		.toBuffer();

	const newPath = path.join(imageDirectory, `${imageName}.jpg`);

	fs.writeFileSync(newPath, jpgImage);
	fs.unlinkSync(imagePath);

	return newPath;
}

export const createImageVersions = async (imageId: string, config: ImageVersionConfig) => {
	const { thumbnail, full, initialImagePath } = config;
	const {
		heights: thumbnailResolutions,
		imageHandler: thumbnailImageHandler,
	} = thumbnail;

	const {
		heights: fullResolutions,
		imageHandler: fullPathImageHandler,
	} = full;

	const image = sharp(initialImagePath);
	const metadata = await image.metadata();
	const width = metadata.width!;
	const height = metadata.height!;
	
	const fullResolutionPromises = fullResolutions.map(async (fullHeight) => {
		console.log(`APPLICATION | Creating full ${fullHeight} of ${imageId}`);

		const resized = await image
			.resize({ height: fullHeight })
			.toBuffer();

		await fullPathImageHandler(resized, fullHeight);
	});

	const thumbnailPromises = thumbnailResolutions.map(async (thumbnailSize) => {
		console.log(`APPLICATION | Creating thumbnail ${thumbnailSize} of ${imageId}`);

		const thumbnail = await image
			.resize({
				height: thumbnailSize,
				width: thumbnailSize,
				fit: sharp.fit.cover,
			})
			.toBuffer();

		await thumbnailImageHandler(thumbnail, thumbnailSize);
	});

	await Promise.all([
		...thumbnailPromises,
		...fullResolutionPromises,
	]);

	return {
		processed: true,
		imageData: {
			height,
			width,
		},
	};
};
