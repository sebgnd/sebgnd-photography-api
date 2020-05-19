import express from 'express';
import { getAll, getFromGallery, deleteImage, getKImagesFromOffset, getImage } from '../controllers/images.controller';

const images = express.Router();

images.get('/', getAll);

images.get('/category/:id', getFromGallery);

images.get('/:offset/:limit', getKImagesFromOffset);

images.get('/:id', getImage)

images.delete('/:id', deleteImage);

export default images;