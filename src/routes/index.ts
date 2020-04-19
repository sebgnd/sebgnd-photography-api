import express from 'express';

import imageRoute from './image.route';
import galleryRoute from './gallery.route';

const routes = express.Router();

routes.use('/images', imageRoute);
routes.use('/galleries', galleryRoute);

export default routes;