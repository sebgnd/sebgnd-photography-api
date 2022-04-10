import express from 'express';

import { imageFileController } from './controller/image-file.controller';

export const fileDomain = express.Router();

fileDomain.use(imageFileController);