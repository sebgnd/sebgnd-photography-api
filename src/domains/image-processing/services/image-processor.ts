import Jimp from 'jimp';

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

export const getCroppedCoordinatesForThumbnail = (info: ImageInfo) => {
	const { thumbnailSize, resizedHeight, resizedWidth } = info;

	const isLandscape = info.originalHeight < info.originalWIdth;

	const x = isLandscape ? (resizedWidth / 2) - (thumbnailSize / 2) : 0; 
	const y = isLandscape ? 0 : (resizedHeight / 2) - (thumbnailSize / 2);

	return { x, y }
}

/**
 * TODO: See if there is a way to imprive the logic
 */
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

	const jimpImage = await Jimp.read(initialImagePath);
	
	const width = jimpImage.getWidth();
	const height = jimpImage.getHeight();
	
	const fullResolutionPromises = fullResolutions.map(async (fullHeight) => {
		console.log(`APPLICATION | Creating full ${fullHeight} of ${imageId}`);

		const resizedPath = fullPathFactory(fullHeight);
		const resized = jimpImage
			.clone()
			.resize(Jimp.AUTO, fullHeight);

		await resized.writeAsync(resizedPath);
	});

	const thumbnailPromises = thumbnailResolutions.map(async (thumbnailSize) => {
		console.log(`APPLICATION | Creating thumbnail ${thumbnailSize} of ${imageId}`);

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

		const thumbnailPath = thumbnailPathFactory(thumbnailSize);

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
