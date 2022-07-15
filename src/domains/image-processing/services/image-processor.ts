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
		pathFactory: (height: number) => string,
	},
	full: {
		/**
		 * The width will be determined automatically.
		 * The final image will have the same aspect ratio
		 * as the original image.
		 */
		heights: number[],
		pathFactory: (height: number) => string,
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

	const jpgImage = await sharp(imagePath)
		.jpeg()
		.toBuffer();

	const imageDirectory = path.dirname(imagePath);
	const [imageName] = path.basename(imagePath).split('.');

	const newPath = path.join(imageDirectory, `${imageName}.jpg`);

	fs.writeFileSync(newPath, jpgImage);

	return newPath;
}

export const createImageVersions = async (imageId: string, config: ImageVersionConfig) => {
	const { thumbnail, full, initialImagePath } = config;
	const {
		heights: thumbnailResolutions,
		pathFactory: thumbnailPathFactory,
	} = thumbnail;

	const {
		heights: fullResolutions,
		pathFactory: fullPathFactory,
	} = full;

	const image = sharp(initialImagePath);
	const metadata = await image.metadata();
	const width = metadata.width!;
	const height = metadata.height!;
	
	const fullResolutionPromises = fullResolutions.map(async (fullHeight) => {
		console.log(`APPLICATION | Creating full ${fullHeight} of ${imageId}`);

		const resizedPath = fullPathFactory(fullHeight);
		const resized = await image
			.resize({ height: fullHeight })
			.toBuffer();

		fs.writeFileSync(resizedPath, resized);
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

		const thumbnailPath = thumbnailPathFactory(thumbnailSize);

		fs.writeFileSync(thumbnailPath, thumbnail);
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
