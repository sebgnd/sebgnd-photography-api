import express from 'express';
import { app } from '../../application';

import { imageFileController } from './controller/image-file.controller';
import { handleImageUploaded } from './event-handler/image-uploaded.handler';

export const imageProcessingDomain = express.Router();

imageProcessingDomain.use(imageFileController);

app.on('images-uploaded', (message: Record<string, any>) => {
	if (message.images) {
		handleImageUploaded(message.images);
	}
});