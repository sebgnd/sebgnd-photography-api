import { app } from '../../application';

import { imageFileController } from './controller/image-file.controller';
import { handleImageUploaded } from './event-handler/image-uploaded.handler';

export const imageProcessingControllers = [imageFileController];

// TODO: add domain utils in to add event handlers
// app.instance.on('images-uploaded', (message: Record<string, any>) => {
// 	if (message.images) {
// 		handleImageUploaded(message.images);
// 	}
// });