import express from 'express';
import { sendImage } from '../controllers/image.controller';

const image = express.Router();

image.get('/:gallery/:size/:id', sendImage);

export default image;