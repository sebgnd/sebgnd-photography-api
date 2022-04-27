import Jimp from 'jimp';

import { getImagePathIfExist } from './image-file-manager';

export type ImageVersionConfig = {
	thumbnail: {
		/**
		 * The thumbnail is a square. Its height is
		 * the same as its width.
		 */
		heights: number[],
	},
	full: {
		/**
		 * The width will be determined automatically.
		 * The final image will have the same aspect ratio
		 * as the original image.
		 */
		heights: number[],
	},
}

export type ImageInfo = {
	originalHeight: number,
	originalWIdth: number,
	resizedWidth: number,
	resizedHeight: number,
	thumbnailSize: number,
}

export const getCroppedCoordinatesForThumbnail = (info: ImageInfo) => {
	const { thumbnailSize, resizedHeight, resizedWidth } = info;

	const isLandscape = info.originalHeight < info.originalWIdth;

	const x = isLandscape ? (resizedWidth / 2) - (thumbnailSize / 2) : 0; 
	const y = isLandscape ? 0 : (resizedHeight / 2) - (thumbnailSize / 2);

	return { x, y }
}
export const getYCoordinates = () => {}

/**
 * TODO: See if there is a way to imprive the logic
 */
export const createImageVersions = async (imageId: string, config: ImageVersionConfig) => {
	const imagePath = getImagePathIfExist(imageId, {
		format: 'full',
		size: 'original',
	});

	if (!imagePath) {
		throw new Error('Original image not found');
	}

	const { thumbnail, full } = config;
	const { heights: thumbnailResolutions } = thumbnail;
	const { heights: fullResolutions } = full;

	const jimpImage = await Jimp.read(imagePath);
	
	const width = jimpImage.getWidth();
	const height = jimpImage.getHeight();
	
	const fullResolutionPromises = fullResolutions.map(async (fullHeight) => {
		console.log(`Creating full ${fullHeight} of ${imageId} ...`);

		/**
		 * TODO: Create this path in the file manager service
		 */
		const resizedPath = `files/images/full/${fullHeight}/${imageId}.jpg`;
		const resized = jimpImage
			.clone()
			.resize(Jimp.AUTO, fullHeight);

		await resized.writeAsync(resizedPath);
	});

	const thumbnailPromises = thumbnailResolutions.map(async (thumbnailSize) => {
		console.log(`Creating thumbnail ${thumbnailSize} of ${imageId} ...`);

		const isLandscape = height < width 
		const resized = jimpImage
			.clone()
			.resize(
				isLandscape ? Jimp.AUTO : thumbnailSize,
				isLandscape ? thumbnailSize : Jimp.AUTO
			);

		const { x, y } = getCroppedCoordinatesForThumbnail({
			originalHeight: height,
			originalWIdth: width,
			resizedHeight: resized.getHeight(),
			resizedWidth: resized.getWidth(),
			thumbnailSize,
		});

		const cropped = resized.crop(x, y, thumbnailSize, thumbnailSize);

		/**
		 * TODO: Create this path in the file manager service
		 */
		const thumbnailPath = `files/images/thumbnail/${thumbnailSize}/${imageId}.jpg`

		await cropped.writeAsync(thumbnailPath);
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
}
