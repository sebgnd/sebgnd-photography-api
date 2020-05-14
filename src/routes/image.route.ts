import express from 'express';
import { sendImage } from '../controllers/image.controller';

const image = express.Router();

image.get('/:category/:size/:id', sendImage);

export default image;