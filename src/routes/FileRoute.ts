import express from 'express';
import { sendImage } from '../controllers/FileController';

const image = express.Router();

image.get('/image/:type/:id', sendImage);

export default image;