import * as fs from 'fs';
import * as path from 'path';
import Jimp from 'jimp';

import { updateImageProcessedData } from '../database/image/image.repository';

export type ImageUploaded = {
	id: string,
	originalName: string,
	temporaryPath: string,
};

/**
 * TODO:
 * Move some of that logic into entities, services.
 * Once the custom framework is created, create an event class/object that
 * can be shared across domains.
 */

export const handleImageUploaded = async (images: ImageUploaded[]) => {
	await Promise.all(
		images.map(async ({ id, originalName, temporaryPath }) => {
			await new Promise((resolve, reject) => {
				const oldPath = temporaryPath;
				const extension = path.extname(originalName);
				const newPath = `files/images/full/original/${id}${extension}`;

				fs.copyFile(oldPath, newPath, (err) => {
					if (err) {
						reject(err);
					}
	
					resolve(undefined);
				});
			});
		}),
	);

	/**
	 * TODO:
	 * This logic can be improved. Went to the most straightforward solution to 
	 * have a working domain.
	 */
	images.forEach(async ({ id }) => {
		const imagePath = `files/images/full/original/${id}.jpg`;
		const jimpImage = await Jimp.read(imagePath);

		const fullResolutions = [400, 1080];
		const thumbnailResolutions = [400, 80];

		const width = jimpImage.getWidth();
		const height = jimpImage.getHeight();

		for (const height of fullResolutions) {
			console.log(`Creating full ${height} of ${id} ...`);

			const resized = jimpImage
				.clone()
				.resize(Jimp.AUTO, height);

			await resized.writeAsync(`files/images/full/${height}/${id}.jpg`);
		}

		for (const heightAndWidth of thumbnailResolutions) {
			console.log(`Creating thumbnail ${heightAndWidth} of ${id} ...`);

			const isLandscape = height < width 
			
			const resized = jimpImage
				.clone()
				.resize(
					isLandscape ? Jimp.AUTO : heightAndWidth,
					isLandscape ? heightAndWidth : Jimp.AUTO
				);

			const x = isLandscape ? (resized.getWidth() / 2) - (heightAndWidth / 2) : 0; 
			const y = isLandscape ? 0 : (resized.getHeight() / 2) - (heightAndWidth / 2);

			const cropped = resized.crop(x, y, heightAndWidth, heightAndWidth);

			await cropped.writeAsync(`files/images/thumbnail/${heightAndWidth}/${id}.jpg`);
		}

		await updateImageProcessedData(id, false, {
			width,
			height,
		});
	});
};
