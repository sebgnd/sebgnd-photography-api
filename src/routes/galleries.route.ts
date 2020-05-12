import express from 'express';
import { getAll, getWithLimit, getWithId } from '../controllers/galleries.controller';

const galleries = express.Router();

galleries.get('/', getAll);

galleries.get('/limit/:limit', getWithLimit);

galleries.get('/:id', getWithId);

export default galleries;