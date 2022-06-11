import { deleteImage } from '@domains/image-processing/services/image-file-manager';

import { EventHandler } from '@libs/famework/event-handler';

export type ImageDeleted = {
	id: string,
};

export type ImageDeleteBody = {
	image: ImageDeleted
};

export const handleImageUploaded: EventHandler<ImageDeleteBody> = async ({ image }) => {
	await deleteImage(image.id);
};
