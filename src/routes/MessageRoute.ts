import express from 'express';
import { check } from 'express-validator';

import { get, getAll, postMessage } from '../controllers/MessageController';

const images = express.Router();

// images.get('/', getAll)
// images.get('/:id', get);

images.post('/', [
    check('name')
        .trim()
        .escape()
        .notEmpty().withMessage('Cannot be empty')
        .isAlpha().withMessage('Cannot contain special characters')
        .isLength({ max: 25 }).withMessage('Cannot be over 25 characters'),
    check('message')
        .trim()
        .escape()
        .notEmpty().withMessage('Cannot be empty')
        .isLength({ max: 2000 }).withMessage('Cannot be over 2000 characters'),
], postMessage)

export default images;