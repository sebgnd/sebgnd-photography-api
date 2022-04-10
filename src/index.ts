import { app } from './application';

import { galleryDomain } from './domains/gallery/gallery.domain';
import { imageProcessingDomain } from './domains/image-processing/image-processing.domain';

const initApp = async () => {
	await app.start([
		{ router: galleryDomain, type: 'api' },
		{ router: imageProcessingDomain, type: 'file' },
	]);
}

initApp();