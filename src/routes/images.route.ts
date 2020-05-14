import express from 'express';
import { getAll, getFromGallery, deleteImage, getKImagesFromOffset } from '../controllers/images.controller';

const images = express.Router();

images.get('/', getAll);

images.get('/category/:id', getFromGallery);

images.get('/:offset/:limit', getKImagesFromOffset);

images.delete('/:id', deleteImage);

export default images;