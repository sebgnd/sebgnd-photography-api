import * as fs from 'fs';
import * as path from 'path';
import Jimp from 'jimp';
import { updateImageProcessing } from '../database/image/image.repository';

export type ImageUploaded = {
	id: string,
	originalName: string,
	temporaryPath: string,
};

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

	images.forEach(async ({ id }) => {
		const imagePath = `files/images/full/original/${id}.jpg`;
		const jimpImage = await Jimp.read(imagePath);

		const fullResolutions = [400, 1080];
		const thumbnailResolutions = [400, 80];

		for (const height of fullResolutions) {
			console.log(`Creating full ${height} of ${id}`);

			const resized = jimpImage
				.clone()
				.resize(Jimp.AUTO, height);

			await resized.writeAsync(`files/images/full/${height}/${id}.jpg`);
		}

		for (const heightAndWidth of thumbnailResolutions) {
			console.log(`Creating thumbnail ${heightAndWidth} of ${id}`);

			const isLandscape = jimpImage.getHeight() < jimpImage.getWidth(); 

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

		await updateImageProcessing(id, false);
	});
};
