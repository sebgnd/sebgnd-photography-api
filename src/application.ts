import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
	path: path.join(__dirname, '..', '.env'),
	debug: true,
});

import { createApplication } from '@libs/famework/application';

import { galleryDomain } from '@domains/gallery/gallery.domain';
import { imageProcessingDomain } from '@domains/image-processing/image-processing.domain';
import { iamDomain } from '@domains/iam/iam.domain';

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
		iamDomain,
	],
	middlewares: [
		bodyParser.json(),
		bodyParser.urlencoded({ extended: true }),
		cookieParser(),
		morgan('dev'),
		cors({
			origin: 'http://localhost:3000',
			credentials: true,
		}),
	],
	beforeStart: async () => {
    await initDatabase();
  },
});