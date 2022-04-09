import express from 'express';
import formidable from 'express-formidable';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

import { initDatabase } from './database';

export let expressApp = null;

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
		start: async (routers: express.Router[]) => {
			await initDatabase();

			routers.forEach((router) => {
				app.use('/api', router);
			});

			app.listen(8000, () => {
				console.log('App started on port 8000');
			});
		}
	};
};

export const app = createApplication();
