import express from 'express';
import { getAll, getWithLimit } from '../controllers/galleries.controller';

const galleries = express.Router();

galleries.get('/', getAll);

galleries.get('/limit/:limit', getWithLimit);

export default galleries;