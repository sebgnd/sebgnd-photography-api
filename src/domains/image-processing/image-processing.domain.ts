import express from 'express';

import { imageFileController } from './controller/image-file.controller';

export const imageProcessingDomain = express.Router();

imageProcessingDomain.use(imageFileController);