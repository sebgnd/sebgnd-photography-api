import * as fs from 'fs';

import { Locality } from '@libs/famework/events/dispatcher';
import { useWorker } from '@libs/famework/worker';

import type { EventHandler } from '@libs/famework/events/handler';
import type { ImageSize } from '@domains/image-processing/services/image-file-manager';

import { updateImageProcessedData } from '@domains/image-processing/database/image/image.repository';
import { convertImageToJpg, createImageVersions } from '@domains/image-processing/services/image-processor';
import { buildImagePath, copyOriginalImage, getImagePathIfExist } from '@domains/image-processing/services/image-file-manager';



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

	console.log(temporaryPath);

	const jpgPath = await convertImageToJpg(temporaryPath);

	await copyOriginalImage(id, jpgPath);

	const initialImagePath = getImagePathIfExist(id, {
		format: 'full',
		size: 'original',
	});

	if (!initialImagePath) {
		throw new Error('Error copying orignal image');
	}

	const { processed, imageData } = await createImageVersions(id, {
		initialImagePath,
		thumbnail: {
			heights: [400, 80],
			pathFactory: (height: number) => {
				return buildImagePath(id, 'thumbnail', height.toString() as ImageSize);
			}
		},
		full: {
			heights: [400, 1080],
			pathFactory: (height: number) => {
				return buildImagePath(id, 'full', height.toString() as ImageSize);
			}
		},
	});

	fs.unlinkSync(temporaryPath);
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
