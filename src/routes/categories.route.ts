import express from 'express';
import { getAll, getWithLimit, getWithId } from '../controllers/categories.controller';

const categories = express.Router();

categories.get('/', getAll);

categories.get('/limit/:limit', getWithLimit);

categories.get('/:id', getWithId);

export default categories;