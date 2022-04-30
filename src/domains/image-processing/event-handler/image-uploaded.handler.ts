import * as fs from 'fs';
import * as path from 'path';

import { updateImageProcessedData } from '@domains/image-processing/database/image/image.repository';
import { createImageVersions } from '@domains/image-processing/services/image-processor';

import { EventHandler } from '@libs/famework/event-handler';
import { Locality } from '@libs/famework/event-dispatcher';

export type ImageUploaded = {
	id: string,
	originalName: string,
	temporaryPath: string,
};

export type ImageUploadBody = {
	images: ImageUploaded[]
};

export const handleImageUploaded: EventHandler<ImageUploadBody> = async ({ images }, eventDispatcher) => {
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

		eventDispatcher.dispatch({
			name: 'image-processing:image-processed',
			locality: Locality.EXTERNAL,
			data: {
				processed,
				id,
			},
		});
	});
};
