import * as fs from 'fs';

import { Locality } from '@libs/famework/events/dispatcher';
import { useWorker } from '@libs/famework/worker';

import type { EventHandler } from '@libs/famework/events/handler';
import { ImageSize, saveFullImage, saveOriginalImage, saveThumbnailImage } from '@domains/image-processing/services/image-file-manager';

import { updateImageProcessedData } from '@domains/image-processing/database/image/image.repository';
import { convertImageToJpg, createImageVersions } from '@domains/image-processing/services/image-processor';

export type ImageUploaded = {
	id: string,
	originalName: string,
	temporaryPath: string,
};

export type ImageUploadBody = {
	image: ImageUploaded
};

export type ImageUploadWorkerResult = {
	processed: boolean,
	imageData: {
		width: number,
		height: number,
	},
}

const imageResizeWorker = useWorker<ImageUploaded, ImageUploadWorkerResult>('image-uploaded-worker', async (image) => {
	const { id, temporaryPath } = image;

	const jpgPath = await convertImageToJpg(temporaryPath);

	await saveOriginalImage(id, jpgPath);

	const { processed, imageData } = await createImageVersions(id, {
		initialImagePath: jpgPath,
		thumbnail: {
			heights: [400, 80],
			imageHandler: async (buffer, height) => (
				saveThumbnailImage(id, height, buffer)
			)
		},
		full: {
			heights: [400, 1080],
			imageHandler: async (buffer, height) => (
				saveFullImage(id, height, buffer)
			),
		},
	});

	fs.unlinkSync(jpgPath);

	return {
		processed,
		imageData,
	};
});

export const handleImageUploaded: EventHandler<ImageUploadBody> = async ({ image }, eventDispatcher) => {
	const { processed, imageData } = await imageResizeWorker!.execute(__filename, image);

	await updateImageProcessedData(image.id, !processed, {
		width: imageData.width,
		height: imageData.height,
	});

	eventDispatcher.dispatch({
		name: 'image-processing:image-processed',
		locality: Locality.EXTERNAL,
		data: {
			id: image.id,
			processed,
		},
	});
};
