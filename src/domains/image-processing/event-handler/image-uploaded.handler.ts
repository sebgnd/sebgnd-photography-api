import { updateImageProcessedData } from '@domains/image-processing/database/image/image.repository';
import { convertImageToPng, createImageVersions } from '@domains/image-processing/services/image-processor';
import { buildImagePath, copyOriginalImage, getImagePathIfExist, ImageSize } from '@domains/image-processing/services/image-file-manager';

import { EventHandler } from '@libs/famework/event-handler';
import { Locality } from '@libs/famework/event-dispatcher';

export type ImageUploaded = {
	id: string,
	originalName: string,
	temporaryPath: string,
};

export type ImageUploadBody = {
	image: ImageUploaded
};

export const handleImageUploaded: EventHandler<ImageUploadBody> = async ({ image }, eventDispatcher) => {
	const { id, temporaryPath } = image;

	const jpgPath = await convertImageToPng(temporaryPath);

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
};
