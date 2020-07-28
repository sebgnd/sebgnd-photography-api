import express from 'express';

import imagesRoute from './ImageRoute';
import categoriesRoute from './CategoryRoute';
import fileRoute from './FileRoute';
import messageRoute from './MessageRoute';

const routes = express.Router();

routes.use('/images', imagesRoute);
routes.use('/file', fileRoute)
routes.use('/categories', categoriesRoute);
routes.use('/messages', messageRoute)

export default routes;