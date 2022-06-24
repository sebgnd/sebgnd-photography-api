import bodyParser from 'body-parser';
import morgan from 'morgan';
import multer from 'multer';
import cors from 'cors';

import { createApplication } from '@libs/famework/application';

import { galleryDomain } from '@domains/gallery/gallery.domain';
import { imageProcessingDomain } from '@domains/image-processing/image-processing.domain';

import { initDatabase } from '@database/index';

export const upload = multer({
	dest: './tmp'
});

export const app = createApplication({
	port: 8000,
	routePrefix: 'api',
	domains: [
		galleryDomain,
		imageProcessingDomain,
	],
	middlewares: [
		bodyParser.json(),
		bodyParser.urlencoded({ extended: true }),
		morgan('dev'),
		cors({
			origin: 'http://localhost:3000'
		}),
	],
	beforeStart: async () => {
    await initDatabase();
  },
});