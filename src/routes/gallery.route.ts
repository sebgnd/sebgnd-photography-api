import express from 'express';
import { getAll, getWithLimit } from '../controllers/gallery.controller';

const gallery = express.Router();

gallery.get('/', getAll);

gallery.get('/:limit', getWithLimit);

export default gallery;