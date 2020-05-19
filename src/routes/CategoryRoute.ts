import express from 'express';
import { getAll, get, getImages } from '../controllers/CategoryController';

const categories = express.Router();

categories.get('/', getAll);

categories.get('/:id', get);
categories.get('/:id/images', getImages);

export default categories;