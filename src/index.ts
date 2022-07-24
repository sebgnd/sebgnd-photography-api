import { app } from './application';

const initApp = async () => {
	await app.start();
}

initApp();