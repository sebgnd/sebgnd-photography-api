import express from 'express';
import { getAll, getFromGallery, deleteImage } from '../controllers/image.controller';

const image = express.Router();

image.get('/', getAll);

image.get('/:gallery', getFromGallery);

image.delete('/:id', deleteImage);

export default image;