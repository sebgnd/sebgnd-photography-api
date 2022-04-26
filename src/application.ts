import formidable from 'express-formidable';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import * as fs from 'fs';

import { createApplication } from './libs/famework/application';

import { galleryControllers } from './domains/gallery/gallery.domain';
import { imageProcessingControllers } from './domains/image-processing/image-processing.domain';

import { initDatabase } from './database';

const initFileSystem = async () => {
	const paths = [
		'files/images/full/400',
		'files/images/full/1080',
		'files/images/full/original',
		'files/images/thumbnail/80',
		'files/images/thumbnail/400',
	];

	console.log('SYSTEM | Initializing file system');

	for (const dirPath of paths) {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, {
				recursive: true,
			});
		}
	}

  return Promise.resolve('fdsafdsa');
}

export const app = createApplication({
	port: 8000,
	routePrefix: 'api',
	controllers: [
		...galleryControllers,
		...imageProcessingControllers,
	],
	middlewares: [
		bodyParser.urlencoded(),
		bodyParser.json(),
		morgan('dev'),
		formidable({ multiples: true }),
		cors(),
	],
	beforeStart: async () => {
    await Promise.all([
      initDatabase(),
      initFileSystem(),
    ]);
  },
});