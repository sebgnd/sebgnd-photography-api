import { app } from './application';

import { galleryDomain } from './domains/gallery/gallery.domain';
import { fileDomain } from './domains/file/file.domain';

const initApp = async () => {
	await app.start([
		{ router: galleryDomain, type: 'api' },
		{ router: fileDomain, type: 'file' },
	]);
}

initApp();