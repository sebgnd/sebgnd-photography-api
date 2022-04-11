import express from 'express';
import formidable from 'express-formidable';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import * as fs from 'fs';

import { initDatabase } from './database';

export type Domain = {
	router: express.Router,
	type: 'api' | 'file',
};

export const initFileSystem = () => {
	const paths = [
		'files/images/full/400',
		'files/images/full/1080',
		'files/images/full/original',
		'files/images/thumbnail/80',
		'files/images/thumbnail/400',
	];

	console.log('Initializing file system ...');

	for (const dirPath of paths) {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, {
				recursive: true,
			});
		}
	}
}

export const createApplication = () => {
	const app = express();

	app.use(bodyParser.urlencoded());
	app.use(bodyParser.json());
	app.use(morgan('dev'));
	app.use(formidable({ multiples: true }))
	app.use(cors());

	return {
		instance: app,
		emit: app.emit,
		on: app.on,
		start: async (domains: Domain[]) => {
			await initDatabase();

			domains.forEach(({ router, type }) => {
				app.use(`/${type}`, router);
			});

			/**
			 * For now, the images will be saved inside the server itself. Later need to
			 * be in a different location
			 */
			initFileSystem();

			app.listen(8000, () => {
				console.log('App started on port 8000');
			});
		}
	};
};

export const app = createApplication();
