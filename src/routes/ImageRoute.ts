import express from 'express';
import { getAll, get } from '../controllers/ImageController';

const images = express.Router();

images.get('/', getAll);

images.get('/:id', get);
images.get('/:id/lense');
images.get('/:id/camera');

export default images;