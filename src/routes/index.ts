import express from 'express';

import imagesRoute from './ImageRoute';
import categoriesRoute from './CategoryRoute';
import fileRoute from './FileRoute';

const routes = express.Router();

routes.use('/images', imagesRoute);
routes.use('/file', fileRoute)
routes.use('/categories', categoriesRoute);

export default routes;