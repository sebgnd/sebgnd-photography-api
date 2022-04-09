import express from 'express';

import { imageController } from './controller/image.controller';
import { categoryController } from './controller/category.controller';

export const galleryDomain = express.Router();

galleryDomain.use('/images', imageController)
galleryDomain.use('/categories', categoryController);
