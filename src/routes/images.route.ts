import express from 'express';
import { getAll, getFromGallery, deleteImage } from '../controllers/images.controller';

const images = express.Router();

images.get('/', getAll);

images.get('/gallery/:id', getFromGallery);

images.delete('/:id', deleteImage);

export default images;