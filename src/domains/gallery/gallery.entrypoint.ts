import express from 'express';

import { imageController } from './controller/image/image.controller';
import { categoryController } from './controller/category/category.controller';

export const galleryEntrypoint = express.Router();

galleryEntrypoint.use('/images', imageController)
galleryEntrypoint.use('/categories', categoryController);
