import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { galleryEntrypoint } from './domains/gallery/gallery.entrypoint';

import { categoryController } from './domains/gallery/controller/category/category.controller';
import { imageController } from './domains/gallery/controller/image/image.controller';

import { initDatabase } from './database';

const initApp = async () => {
  await initDatabase();

	const app = express();

	app.use(bodyParser.urlencoded());
	app.use(bodyParser.json());
	app.use(cors());

	app.use('/api', galleryEntrypoint);

	app.listen(8000, () => {
		console.log('Server started on port 8000')
	});
}

initApp();