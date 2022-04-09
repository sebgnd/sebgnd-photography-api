import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { initDatabase } from './database';

export let expressApp = null;

export const createApplication = () => {
	const app = express();

	app.use(bodyParser.urlencoded());
	app.use(bodyParser.json());
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
