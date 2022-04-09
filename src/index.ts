import { app } from './application';

import { galleryDomain } from './domains/gallery/gallery.domain';

const initApp = async () => {
	await app.start([galleryDomain]);
}

initApp();