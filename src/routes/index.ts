import express from 'express';

import imagesRoute from './images.route';
import categoriesRoute from './categories.route';
import imageRoute from './image.route';

const routes = express.Router();

routes.use('/images', imagesRoute);
routes.use('/image', imageRoute)
routes.use('/categories', categoriesRoute);

export default routes;