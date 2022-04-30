import { createDomain } from '../../libs/famework/domain';

import { imageFileController } from './controller/image-file.controller';
import { handleImageUploaded } from './event-handler/image-uploaded.handler';

export const imageProcessingDomain = createDomain({
	name: 'image-processing',
	controllers: [imageFileController],
	eventHandlers: {
		'images:uploaded': handleImageUploaded,
	},
});
