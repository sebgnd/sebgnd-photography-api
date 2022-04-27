import * as fs from 'fs';
import * as path from 'path';
import Jimp from 'jimp';

import { updateImageProcessedData } from '../database/image/image.repository';
import { createImageVersions } from '../services/image-processor';

export type ImageUploaded = {
	id: string,
	originalName: string,
	temporaryPath: string,
};

/**
 * TODO:
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

	images.forEach(async ({ id }) => {
		const { processed, imageData } = await createImageVersions(id, {
			thumbnail: {
				heights: [400, 80],
			},
			full: {
				heights: [400, 1080]
			},
		});

		await updateImageProcessedData(id, !processed, {
			width: imageData.width,
			height: imageData.height,
		});
	});
};
