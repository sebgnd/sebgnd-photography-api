import express from 'express';

import imagesRoute from './images.route';
import galleriesRoute from './galleries.route';
import imageRoute from './image.route';

const routes = express.Router();

routes.use('/images', imagesRoute);
routes.use('/image', imageRoute)
routes.use('/galleries', galleriesRoute);

export default routes;